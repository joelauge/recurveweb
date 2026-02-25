# RecourseLLM Skills Architecture — Guiding Document

## Foundational Thesis

RecourseLLM inverts the standard LLM architecture. Instead of feeding context
into the model's context window — where scale costs tokens, hits ceilings, and
loses information — context lives **outside** the model in an external
orchestrated environment. The LLM generates code that operates on named
variables in a REPL namespace. The model sees only variable metadata (names,
types, sizes), never full values.

This is the *recourse*: computation exits the context window.

```
Standard LLM:   Document → tokens → context window → reasoning → answer
RecourseLLM:    Document → REPL variable → code operates on it → FINAL_VAR
                           ↑ model never sees content ↑
```

`FINAL_VAR` is the universal exit signal: whatever the user asked for, the
completed result is written here. That could be a conversational answer, a
generated codebase, a data analysis report, a file path to a built artifact,
or any other outcome the initial interaction demanded. The REPL doesn't
prescribe the *shape* of the result — it provides the orchestrated
environment in which arbitrary work is carried out externally, and
`FINAL_VAR` is how that work is delivered back to the user.

Every design decision in this document follows from this principle. If a
proposed change moves data *into* the context window when it could remain in
the REPL namespace, it violates the architecture.

---

## Layer Model

The system is a five-layer stack. Each layer can access all layers below it.
Layer 0 is the foundation — the external working memory that gives this project
its name.

```
┌──────────────────────────────────────────────────────────────────┐
│  LAYER 0: Context Variables / External Working Memory            │
│                                                                  │
│  SemanticREPLDict  — REPL namespace with auto-ChromaDB indexing  │
│  SessionMemory     — explicit remember()/recall() offload store  │
│  BT Blackboard     — typed cross-node state for BT orchestration │
│                                                                  │
│  Principles:                                                     │
│  • Every variable assignment auto-embedded by SemanticREPLDict   │
│  • find_variable("semantic query") → name + preview, not value   │
│  • LLM sees metadata only: name, type, len — NEVER full content  │
│  • FINAL_VAR signals task completion                             │
│  • Data flows between components by variable name reference      │
└──────────────────────────────────────────────────────────────────┘
         ↕  code reads/writes variables by name
┌──────────────────────────────────────────────────────────────────┐
│  LAYER 1: SafeREPL Execution                                     │
│                                                                  │
│  LLM generates Python code that operates on Layer 0 state.       │
│  Code carries operations, not data. Sandboxed with timeout       │
│  protection and restricted builtins.                             │
│  get_metadata() returns only shapes — never values — to the LLM. │
└──────────────────────────────────────────────────────────────────┘
         ↕  tools injected into REPL namespace
┌──────────────────────────────────────────────────────────────────┐
│  LAYER 2: REPL Tool Registry (42+ primitives)                    │
│                                                                  │
│  Capability primitives that populate and transform Layer 0.      │
│  read_file → writes to REPL var. web_search → writes to var.     │
│  Discoverable via find_tool("semantic query").                   │
│  Zero tokens in system prompt — on-demand semantic lookup.       │
└──────────────────────────────────────────────────────────────────┘
         ↕  skills read/write Layer 0 variables
┌──────────────────────────────────────────────────────────────────┐
│  LAYER 3: Skills                                                 │
│                                                                  │
│  Composable, file-based, ChromaDB-indexed capabilities.          │
│  Four types: code, agent, chain, bt.                             │
│  sub_RLM/sub_RLM_batch delegate tasks (not data) to sub-models.  │
│  Self-registration: model can create new skills at runtime.      │
└──────────────────────────────────────────────────────────────────┘
         ↕  BT nodes read/write blackboard + repl_env
┌──────────────────────────────────────────────────────────────────┐
│  LAYER 4: BT Orchestration Trees                                 │
│                                                                  │
│  Reactive coordination via py_trees behavior trees.              │
│  SUCCESS/FAILURE/RUNNING state, parallel composites, selectors.  │
│  Domain-specific nodes, fallback chains, visual editor.          │
│  Blackboard is the BT's view into Layer 0 working memory.        │
└──────────────────────────────────────────────────────────────────┘
```

### Cross-cutting: Data Never Flows Up

When `sub_RLM("summarise the revenue section")` is called, the sub-model
accesses the document through the shared REPL namespace — the document is
already in Layer 0. The delegation call carries a *task description*, not
content. This is why `sub_RLM_batch` can fan out dozens of parallel tasks
cheaply: the data is already in the external store.

---

## Layer 0: Context Variables

### Implementation

| Component | File | Role |
|-----------|------|------|
| `SemanticREPLDict` | `semantic_repl_env.py` | Dict subclass; every `__setitem__` auto-embeds the value into ChromaDB via `SessionMemory.remember()` |
| `SessionMemory` | `session_memory.py` | Per-session ChromaDB collection; explicit `remember(content)` / `recall(query)` interface |
| `SafeREPL.get_metadata()` | `repl.py` | Returns variable names, types, and sizes — never values — to the LLM between iterations |
| `find_variable()` | `semantic_repl_env.py` | Semantic search over REPL variables by content; returns variable name + preview |
| BT Blackboard | `py_trees` | Typed key-value store shared across all BT nodes; currently stores `repl_env` as a value |

### Invariants

1. **The LLM never receives full variable values.** It receives metadata
   (name, type, length, 50-char preview) and generates code that references
   variables by name.

2. **Variable assignment is automatic indexing.** Writing `doc = read_file("x")`
   in the REPL automatically embeds `doc`'s content in ChromaDB. No explicit
   `remember()` call needed.

3. **Semantic retrieval replaces context loading.** Instead of loading a
   10,000-token document into the prompt, the model calls
   `find_variable("financial projections")` to discover the variable name,
   then generates code that slices, transforms, or delegates against it.

### Future: Unified State Bus

The REPL namespace (`repl_env`) and the BT blackboard are currently two
separate external state stores with manual bridging. BT nodes reach into
`repl_env` via `self.blackboard.get("repl_env")` — double indirection.

**Target state:** A single unified namespace where a variable written by REPL
code is immediately visible to the next BT node tick, and a BT node writing to
the blackboard is immediately accessible as a REPL variable. This eliminates
the bridging boilerplate in nodes like `HierarchicalMapReduceAction` and
`ParallelSubRLMAction`.

---

## Layer 1: SafeREPL

### Execution Cycle

```
1. Model receives: variable metadata + query + iteration history
2. Model generates: Python code block
3. Code extracted from markdown (extract_code_from_markdown)
4. Code executed in SafeREPL sandbox (exec with restricted builtins)
5. Variables written back to Layer 0 (SemanticREPLDict auto-indexes)
6. get_metadata() produces state summary for next iteration
7. If FINAL_VAR is set → done. Otherwise → repeat from step 1.
```

### Key Properties

- **State persists across iterations.** `self.globals.update(self.locals)`
  after each exec means variables accumulate. The model builds up computation
  incrementally.

- **Timeout protection.** SIGALRM-based timeout (default 10s) prevents
  runaway code from blocking the system.

- **History tracking.** Each execution is recorded in `self.history` with
  code, output, and FINAL_VAR state — available for debugging and the UI.

---

## Layer 2: REPL Tool Registry

### Design Principles

- **Zero-token discovery.** Tool signatures are NOT in the system prompt.
  The model calls `find_tool("semantic query")` to discover tools on demand.
  This keeps the system prompt lean regardless of how many tools exist.

- **Results go to variables, not context.** `doc = read_file("report.pdf")`
  puts the content in the REPL namespace. The model never receives it.

- **Tools are injected, not imported.** The REPL sandbox cannot import
  arbitrary modules. Tools are injected into the namespace at orchestrator
  initialization as callable functions.

### Tool Categories

Filesystem, network, shell, data transformation, search, git, SSH, APIs,
package management, PDF generation, research (Stack Overflow, GitHub, PyPI).
42+ primitives total.

### Protected Functions

`sub_RLM`, `sub_RLM_batch`, and `chunk_text` are injected AFTER the tool
registry at a higher priority level. They cannot be overwritten by any tool
or skill with the same name. This guarantees recursive delegation is always
available.

---

## Layer 3: Skills

### Current Skill Types

| Type | Format | Execution |
|------|--------|-----------|
| `code` | `.py` file with docstring metadata | Dynamic import + call; REPL env injected into module globals |
| `agent` | `.md` with YAML frontmatter | Template rendered with `{{query}}`/`{{context}}`, dispatched via `sub_RLM()` |
| `chain` | `.md` with `chain:` step list | Sequential skill execution; each step's output feeds the next |

### Discovery

ChromaDB-backed semantic search using `all-MiniLM-L6-v2` embeddings.
`find_skill("extract tables from document")` returns matching skill names,
types, and descriptions. Falls back to keyword search when ChromaDB is
unavailable.

### Self-Registration

`register_skill(name, description, content, skill_type, tags)` persists a
new skill file to `skills/`, embeds its description, and upserts the ChromaDB
index. The skill is immediately available without process restart. This enables
emergent skill libraries that grow through use.

### Skill Files (Current)

```
skills/
├── extract_tables.py          # code: HTML/Markdown/text table extraction
├── chunk_and_analyse.py       # code: parallel sub_RLM_batch over chunks
├── summarise_document.md      # agent: document summarisation template
├── research_topic.md          # chain: parallel web search → synthesis
└── git_pr_review.md           # agent: PR review template
```

---

## Layer 4: BT Orchestration

### Tree Structure

```
REPL Orchestrator (Selector)
├─ Simple Request Path
│   └─ IsSimpleRequestCondition → DirectProcessAction
├─ Timeout Check
│   └─ IsMaxIterationsReached → Set timeout flag
├─ SubRLM Decomposition Shortcut
│   └─ ForceSubRLMDecompositionAction (large context, iteration 1 only)
└─ Final Synthesis Fallback (Selector)
    ├─ Specialized Extraction Nodes
    │   ├─ CreatorExtractionAction      ("Who created X?")
    │   ├─ CauseExtractionAction        ("What caused X?")
    │   ├─ SuccessorExtractionAction    ("Who succeeded X?")
    │   ├─ AttributeExtractionAction    ("X did Y for which Z?")
    │   ├─ SuperlativeExtractionAction  ("First/last X to Y?")
    │   └─ DirectFactoidQAAction        (catch-all factoid)
    ├─ Domain-Specific Processing Nodes
    │   ├─ MultiSourceFusionAction      (conflict resolution)
    │   ├─ AcademicDocumentAction       (paper processing)
    │   ├─ RetrieveSynthesizeAction     (multi-passage retrieval)
    │   ├─ ExtractiveQAAction           (exact span extraction)
    │   └─ HierarchicalMapReduceAction  (extreme long context)
    ├─ Main REPL Loop (Sequence)
    │   ├─ GenerateCodeWithRecursiveAction
    │   ├─ ExtractCodeBlocksAction
    │   ├─ ExecuteREPLAction
    │   ├─ UpdateHistoryAction
    │   └─ IntelligentRetryAction
    ├─ ContextSearchAction
    ├─ TieredKnowledgeResolutionAction
    └─ SynthesizeFinalAnswerAction
```

### Key Patterns

- **Domain nodes are hardcoded skills.** `HierarchicalMapReduceAction`
  directly calls `chunk_text` and `sub_RLM_batch` from `repl_env`. It is
  functionally identical to the `chunk_and_analyse.py` skill but with
  proper timeout handling, SUCCESS/FAILURE propagation, and blackboard
  visibility.

- **Multi-model delegation.** Root model handles iteration 1 (full context
  understanding). Recursive model pool handles iterations 2+ (incremental
  refinement, 10–20× faster). `ForceSubRLMDecompositionAction` uses root
  once to decompose, then fans out via `sub_RLM_batch` across the pool.

- **XML tree loading.** `BehaviorTreeLoader` can instantiate trees from XML
  files, enabling visual editing and persistence of custom trees.

---

## Integration Strategy: Agent Skills → RecourseLLM

### Comparison with Anthropic Agent Skills

| Dimension | Anthropic Agent Skills | RecourseLLM |
|-----------|----------------------|-------------|
| Where context lives | LLM context window (loaded progressively) | Layer 0 external REPL namespace |
| How skills get data | Content loaded into context by level | Reference variable names in REPL env |
| More documents = | More context tokens, more cost | No additional LLM cost |
| Scale ceiling | Context window size | System memory/compute |
| Model's job | Interpret loaded content | Write code operating on named variables |
| Skill execution | bash subprocess → output only | REPL injection → full env access |
| Self-registration | Not supported | Model creates skills at runtime |
| Reactive orchestration | Not supported | BT trees with SUCCESS/FAILURE |

Anthropic's progressive disclosure is an optimization *within* the context
window paradigm. RecourseLLM's approach is an escape *from* it.

### What to Adopt

**1. Directory structure per skill + SKILL.md entry point**

```
skills/
├── extract_tables/
│   ├── SKILL.md              ← metadata + instructions
│   ├── README.md             ← optional: detailed docs (Level 3 resource)
│   └── extract_tables.py     ← code (loaded + injected into REPL)
├── summarise_document/
│   ├── SKILL.md              ← agent template lives here
│   └── EXAMPLES.md           ← loaded lazily for complex cases
└── parallel_research/
    ├── SKILL.md
    └── tree.xml              ← BT subtree definition
```

`SKILL.md` frontmatter provides ChromaDB embeddings. The body provides
instructions when triggered. Bundled files (`.py`, `.md`, `.xml`) are Level 3
resources loaded on demand.

**Priority: High.** Enables bundled resources, secondary docs, and BT subtrees.

**2. Hybrid Level 1 manifest — "skills brief"**

Neither zero-token (current) nor full metadata in prompt (Anthropic). A one-
line-per-skill summary injected into the system prompt at startup:

```
Available skills (call find_skill() for details):
extract_tables, summarise_document, chunk_and_analyse, research_topic, git_pr_review
```

~20–30 tokens regardless of library size. Removes the "model must know to
look" problem. Triggers the model to call `find_skill()` for specifics.

**Priority: High.** Low cost, fixes passive discovery gap.

**3. `when_to_use` metadata field**

Separate "what it does" from "when to use it" in skill metadata. The
embedding index can weight `when_to_use` more heavily for semantic search:

```yaml
---
name: extract_tables
description: Extract all tables from HTML, Markdown, or plain text
when_to_use: Use when the user asks about tabular data, spreadsheets, or structured data extraction
---
```

**Priority: Medium.** Improves semantic matching quality.

**4. Lazy-load skill bodies**

Currently `_load_all_skills()` reads full file contents at startup. For
instruction-heavy agent skills, load on first access:

```python
body = record.body or Path(record.file_path).read_text()
```

**Priority: Medium.** Reduces startup latency for large skill libraries.

### What NOT to Adopt

- **Loading content into context.** Anthropic's Level 2 (SKILL.md body into
  context) is fine for instructions. It should NEVER be used to load data
  content. Data stays in Layer 0.

- **bash subprocess execution.** Anthropic skills run scripts via bash and
  only capture output. RLM skills execute in the REPL namespace with full
  access to `sub_RLM`, `sub_RLM_batch`, and all Layer 0 variables. This is
  strictly more powerful and must be preserved.

---

## New Skill Type: `bt` (Behavior Tree Backed)

### Motivation

The current `chain` type is sequential and unconditional — a flat list of
skill names executed in order. The BT layer provides reactive control flow
(Selector fallbacks, Parallel composites, SUCCESS/FAILURE branching) that
`chain` cannot express. Rather than enriching `chain` into a full
programming language, expose the existing BT infrastructure as a skill type.

### How It Works

A `bt` skill stores a reference to a BT subtree (XML file or named node
class). When `skill("parallel_research")` is called:

```
find_skill("research with parallel sources")
→ parallel_research [bt] found
→ skill("parallel_research", query=...)
→ SkillRegistry loads tree.xml via BehaviorTreeLoader
→ subtree ticks with repl_env + blackboard
→ final_answer written to blackboard
→ returned to caller as a string
```

The model calls `skill()` as before. The BT complexity is encapsulated.

### `SkillDispatchAction` — BT node that invokes any skill

Closes the loop: BT trees can dispatch skills, and skills can execute BT
subtrees. A new BT node that reads `skill_name` from the blackboard and
dispatches to `SkillRegistry`:

```python
Sequence("Specialized Research Path", children=[
    IsResearchQueryCondition(),
    SkillDispatchAction("research_topic"),
    SynthesizeFinalAnswerAction()
])
```

### BT Nodes as Discoverable Skills

Existing BT node classes (`HierarchicalMapReduceAction`,
`MultiSourceFusionAction`, etc.) can be indexed in `SkillRegistry` alongside
file-based skills, making them discoverable via `find_skill()`:

```
find_skill("map reduce long document")
→ HierarchicalMapReduce [bt_node]: Hierarchical map-reduce for documents
  exceeding context window limits
```

### Runtime BT Skill Registration

Extend `register_skill(skill_type="bt")` to accept XML content. The model
can compose and register new BT-backed skills from within the REPL:

```python
register_skill(
    name="parallel_web_research",
    description="Parallel web search with multi-source fusion",
    skill_type="bt",
    content="<root><BehaviorTree ID='PW'>...</BehaviorTree></root>"
)
```

---

## Skill Interface: Variable-Name Passing

### Current (Value Passing)

```python
skill("extract_tables", source=document_text)  # full value in call
```

This violates the Layer 0 principle: the document content flows through the
skill call, potentially entering a sub-model's context.

### Target (Name Passing)

```python
document_text = read_file("report.pdf")           # Layer 0
skill("extract_tables", source_var="document_text", output_var="tables")
# tables now in REPL namespace — never passed through LLM context
```

The skill reads from `repl_env["document_text"]` and writes to
`repl_env["tables"]`. The skill interface specifies its contract:

```python
"""
skill: financial_analysis
description: Extract and analyse financial tables
input_vars: [document_var]
output_vars: [tables, summary]
"""
def financial_analysis(document_var="document_text", **env):
    doc = env[document_var]
    # ...operate on doc...
    env["tables"]  = extracted_tables
    env["summary"] = analysis_summary
```

`input_vars` / `output_vars` in metadata documents the data flow contract
without requiring the model to understand the implementation.

---

## Conditional Chain DAG

Replace the flat sequential `chain` type with a conditional DAG format. This
bridges the gap between simple chains and full BT subtrees:

```yaml
chain:
  - step: web_search_skill
    output_var: search_results
  - step: synthesise_findings_skill
    input_var: search_results
    condition: "len(search_results) > 100"
    fallback: summarise_document
```

Still YAML, no code required. But supports branching and variable-name-based
data flow, consistent with the Layer 0 principle.

---

## Narrow REPL Injection for Code Skills

### Current

```python
# skill_registry.py _execute_code_skill
if self._repl_env_ref:
    module.__dict__.update(self._repl_env_ref)  # injects 50+ names
```

### Target

Only expose the composition primitives. Skills that need HTTP, filesystem,
etc. should receive them as explicit kwargs or import from the tool registry:

```python
SKILL_INJECTION_ALLOWLIST = {
    "sub_RLM", "sub_RLM_batch", "chunk_text",
    "find_skill", "skill", "register_skill",
    "remember", "recall", "find_variable",
}
```

This prevents namespace pollution and makes skill dependencies explicit.

---

## Implementation Priority

| # | Change | Value | Effort | Priority |
|---|--------|-------|--------|----------|
| 1 | Skills brief in system prompt | Fixes passive discovery | Low | **High** |
| 2 | Directory structure + SKILL.md | Enables Level 3 resources + bt skills | Medium | **High** |
| 3 | `bt` skill type + SkillDispatchAction | Full BT↔skill composability | Medium | **High** |
| 4 | Variable-name passing interface | Enforces Layer 0 principle | Medium | **High** |
| 5 | `when_to_use` metadata | Better semantic matching | Low | Medium |
| 6 | Lazy-load skill bodies | Startup performance | Low | Medium |
| 7 | Conditional chain DAG | Expressiveness short of full BT | Medium | Medium |
| 8 | Narrow REPL injection scope | Correctness/security | Low | Medium |
| 9 | Unified repl_env ↔ blackboard | Eliminates bridging boilerplate | High | Medium |
| 10 | BT nodes as discoverable skills | Exposes existing capabilities | Low | Low |
| 11 | Runtime BT skill registration | Emergent orchestration patterns | Medium | Low |

---

## Invariants — What Must Be Preserved

1. **REPL injection execution model.** Skills execute inside the REPL
   namespace with direct access to context variables and recursive delegation
   functions. Never replace this with bash subprocess execution.

2. **`sub_RLM` passes tasks, not data.** Delegation calls carry task
   descriptions. The sub-model accesses data through the shared Layer 0
   namespace.

3. **Protected injection order.** `sub_RLM`, `sub_RLM_batch`, `chunk_text`
   are injected after tools and skills — they cannot be shadowed.

4. **Self-registration.** The model can create and persist new skills at
   runtime. This is a core differentiator.

5. **Zero-token tool/skill discovery.** Tools and skills live outside the
   system prompt. `find_tool()` and `find_skill()` provide on-demand
   semantic lookup. The skills brief (item #1) supplements but does not
   replace this.

6. **Context stays in Layer 0.** No design change should move document
   content, intermediate results, or working data into the LLM context
   window when it could remain in the REPL namespace.

---

## File Reference

| File | Layer | Role |
|------|-------|------|
| `repl.py` | 1 | SafeREPL sandbox, code execution, metadata generation |
| `semantic_repl_env.py` | 0 | SemanticREPLDict, find_variable, ChromaDB auto-indexing |
| `session_memory.py` | 0 | Per-session remember/recall semantic memory |
| `repl_tools.py` | 2 | REPLToolRegistry, 42+ capability primitives |
| `skill_registry.py` | 3 | SkillRegistry, find_skill/skill/register_skill |
| `bt_orchestrator.py` | 4 | REPLOrchestrator, tree construction, sub_RLM injection |
| `bt_nodes.py` | 4 | Core REPL BT nodes (generate, extract, execute, update) |
| `bt_nodes_improved.py` | 4 | Enhanced nodes (recursive model, decomposition, domain-specific) |
| `bt_nodes_repl.py` | 4 | Re-export module for BT editor discovery |
| `bt_tree_loader.py` | 4 | XML-based BT tree loading and validation |
| `bt_editor_adapter.py` | 4 | Visual BT editor integration |
| `bt_ui_server.py` | 4 | Web UI for monitoring and editing |
| `core_repl.py` | 1–4 | Main entry point, wires all layers together |

---

*This document reflects the architectural state and integration strategy as
of February 2026. It should be updated as the items in the implementation
priority table are completed.*
