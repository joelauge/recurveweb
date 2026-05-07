# The First Local-First AI Orchestration Stack with Persistent Supervector Memory

We built RLLM, a Behavior Tree–orchestrated AI framework that routes tasks to specialist models, keeping frontier-model tokens for the work that actually requires them. Then we realized the stack had a deeper problem: every session started from zero. KnowDB fixes that.

**RecourseLLM Team - Pierre Augé, Joel Augé**
*April 2026*

---

### Table of Contents

- [The Problem With How Agents Remember](#the-problem-with-how-agents-remember)
- [RLLM Architecture](#rllm-architecture)
  - [Behavior Tree Orchestration](#behavior-tree-orchestration)
  - [External Working Memory](#external-working-memory)
  - [Specialist Routing](#specialist-routing)
  - [CodeComplianceGate](#codecompliancegate)
- [KnowDB: Session Data as Supervector Memory](#knowdb-session-data-as-supervector-memory)
  - [What Gets Stored](#what-gets-stored)
  - [Namespace Architecture](#namespace-architecture)
  - [Retrieval](#retrieval)
- [Cost Per Work Unit](#cost-per-work-unit)
- [Compliance as Architecture, Not Policy](#compliance-as-architecture-not-policy)
- [What's Next](#whats-next)

---

**We built RLLM, a Behavior Tree–orchestrated AI framework that routes tasks to specialist models rather than a single frontier model.** The orchestration layer runs local-first - no data leaves your infrastructure - and every decision the system makes is a traversable, auditable artifact. On top of that, we built KnowDB: a customized LanceDB OSS layer that turns every RLLM session into a persistent, supervector-searchable memory store. Together they form the first AI stack where the system genuinely remembers what it has done, why it did it, and what it cost.

Before we built this, the recipe for deploying AI in regulated environments was: pick a frontier model, wrap it in a prompt, and pray it stays within policy. Agents built this way forget everything between sessions. Every context window is amnesiac. Reconstructing prior state from scratch consumes tokens that produce no new value. And every inference call sends data to someone else's infrastructure, where it is logged, retained, and potentially used for training - structurally incompatible with PIPEDA, HIPAA, and broadcast regulatory frameworks.

RLLM and KnowDB were built to make that entire approach unnecessary.

---

## The Problem With How Agents Remember

Current agent frameworks treat memory as an afterthought. The dominant pattern is: stuff relevant documents into the context window via RAG, generate a response, discard the session. If you want the agent to "remember" something, you write it to a database manually - a separate system, with separate versioning, separate embeddings, separate retrieval. The agent does not know what it did last week. It does not know which specialist model handled a similar task two months ago. It does not know that the compliance gate rejected a query on Tuesday for a reason that is directly relevant to the query it is processing on Thursday.

The agent's own execution history - the Behavior Tree traversal paths, the EWM state snapshots, the tool calls, the model I/O - is the highest-signal data that exists about what the system knows how to do and how it behaves under pressure. The failure is architectural: that data is being thrown away.

KnowDB was built to stop throwing it away.

---

## RLLM Architecture

### Behavior Tree Orchestration

RLLM's orchestration layer is built on `py_trees`, a Python implementation of Behavior Trees. Unlike the "loop forever and hope" pattern used by most agent frameworks, a Behavior Tree is a first-class executable artifact. Every node in the tree has a defined return status: `SUCCESS`, `FAILURE`, or `RUNNING`. Composite nodes - `Sequence`, `Selector`, `Parallel` - compose these into deterministic execution paths.

A `Sequence` node runs its children left to right, failing immediately if any child fails. A `Selector` runs children until one succeeds, providing fallback logic without special-case code. A `Parallel` node runs multiple children simultaneously and returns based on a configurable success/failure threshold.

The result is that every task the system executes is described by a tree structure that can be inspected, replayed, and diffed. When a task fails, the system surfaces the exact node that returned `FAILURE`, the state of the EWM at that point, and the full sequence of nodes that led there. This is the audit trail that compliance frameworks require, delivered as a structural property of the system rather than bolted on afterward.

The BT Web UI - what we sometimes call the Governance Dashboard - exposes this tree in real time. An operations manager watching a live deployment sees every tick of the tree, every model invocation, every gate passage. In a regulated broadcasting or healthcare deployment, that visibility functions as the evidence layer - the auditable record of every decision the system made.

### External Working Memory

RLLM maintains an External Working Memory (EWM) - a structured key-value store that persists across the lifetime of a session. The EWM is the shared state layer that all BT nodes read from and write to. Unlike the context window, which is ephemeral and token-bounded, the EWM is managed by the orchestrator, not the model.

Models that manage their own state hallucinate. They forget what they wrote two steps ago and produce inconsistent references to prior outputs. The EWM removes state management from the model entirely. The BT nodes write structured outputs to named EWM slots. Downstream nodes read from those slots. The model is given only what it needs for its specific subtask.

A typical session might have 15–30 active EWM keys at peak complexity. The orchestrator prunes stale keys at BT subtree boundaries. Because EWM state is a Python dict serializable to JSON, it can be snapshotted at any tick and replayed for debugging or audit purposes.

### Specialist Routing

Rather than passing every task to a single frontier model, RLLM maintains a registry of specialist models - smaller, fine-tuned, or locally-deployed models optimized for specific task types. The root model receives the user's intent, decomposes it into subtasks, and the BT routes each subtask to the appropriate specialist.

The routing decision is encoded structurally in the BT. A `Selector` node might try a local 7B model first, fall back to a 13B quantized model if the first returns `FAILURE`, and only escalate to an API-hosted model if both fail. This fallback chain is defined at BT authoring time and is visible in the Governance Dashboard.

The practical effect: a task that a frontier model would handle end-to-end in one 4,000-token inference call might be decomposed into four subtasks, each handled by a specialist averaging 800 tokens. Total token cost: approximately 3,200, with the bulk of inference running locally at near-zero marginal cost.

### CodeComplianceGate

Before any generated code executes, it passes through the CodeComplianceGate - a pre-execution policy enforcement node in the BT. The gate inspects the proposed execution against a configurable ruleset: forbidden imports, disallowed syscalls, output destination restrictions, PII pattern detection.

If the gate returns `FAILURE`, the BT `Sequence` fails at that node. The failure propagates up to the parent `Selector`, which may attempt a remediation subtree - reformulating the code generation prompt with the violation context, or escalating to human review. No code executes that has not cleared the gate.

The gate runs as a structural execution barrier in the same process as the orchestrator, before the sandbox environment is invoked. In an air-gapped deployment, pre-execution enforcement at this layer is the defining property of a compliant system.

---

## KnowDB: Session Data as Supervector Memory

KnowDB is a customized deployment of LanceDB OSS - an embedded, multimodal, zero-copy vector database built on the Lance columnar format - modified to ingest RLLM session data as its primary write path. KnowDB's schema extends the standard LanceDB document-and-embedding model to capture the full operational record: BT execution traces, EWM snapshots, model I/O pairs, tool call records, CodeComplianceGate decisions, token counts, latency measurements, and namespace metadata.

The result is that RLLM's operational history becomes a searchable, versioned, multimodal knowledge store. A query issued today can retrieve a semantically similar query from six months ago, alongside the exact BT path that handled it, the specialist that answered it, and what it cost in tokens.

### What Gets Stored

Every RLLM session produces a structured event stream. KnowDB ingests this stream into a set of Lance tables, each representing a namespace:

**`bt_traces`** - Full BT execution traces per session tick. Each row includes the tree hash, the active node path, the tick result, and the EWM state snapshot at that tick. Stored as JSON with a vector embedding of the semantic intent of the active subtree.

**`ewm_snapshots`** - Point-in-time snapshots of the EWM dict at BT subtree boundaries. Queryable by key pattern, session ID, or semantic similarity to a query string. This is the "what did the system know at step N" table.

**`model_io`** - Every model invocation: specialist identifier, input tokens, output tokens, latency in milliseconds, return status. Vector embedding of the input prompt for semantic retrieval.

**`tool_calls`** - Tool invocations from any BT node: name, parameters, output, success/failure, latency. Useful for discovering which tools were effective on which task types.

**`gate_decisions`** - CodeComplianceGate records: proposed code hash, violation flags, remediation path taken, final gate status. These records are the compliance audit trail.

**`session_metadata`** - Session-level summary: user namespace, task intent, total token cost, wall-clock duration, BT depth, specialist mix. The Cost per Work Unit metric is computed here.

### Namespace Architecture

KnowDB organizes all data under a namespace hierarchy that mirrors RLLM's deployment topology: `org / deployment / user / session`. Retrieval respects namespace boundaries by default - a query in the `ccci/broadcast-ops/joela` namespace does not cross into `ccci/hr-admin` without an explicit cross-namespace join.

KnowDB achieves PIPEDA compliance structurally rather than by policy configuration. Data isolation is enforced at the Lance table schema level, where the namespace is a partition key that must be present in every query predicate. A query that omits the namespace predicate fails to compile - there is no administrative override that can accidentally broaden access.

For air-gapped deployments, each node in the RLLM distributed worker topology maintains its own KnowDB shard. Cross-node retrieval happens over a local network query layer - no internet dependency, no cloud storage, no external embedding API. The embedding model runs locally alongside the database.

### Retrieval

KnowDB supports three retrieval modes, composable in a single query:

**Vector search** - Cosine similarity over embedded fields. A query like "find sessions where the compliance gate triggered on file write operations" embeds the query string and retrieves semantically similar `gate_decisions` rows. The underlying index uses LanceDB's IVF-PQ (Inverted File with Product Quantization) for approximate nearest-neighbor search at scale.

**Full-text search** - Keyword search over raw text fields using LanceDB's built-in Tantivy integration. Useful for exact tool names, error messages, or known BT node identifiers.

**SQL predicate filtering** - Lance's Arrow-based columnar format supports DuckDB-style SQL predicates directly on the Lance tables. Filtering by `session_metadata.total_tokens < 2000 AND session_metadata.task_type = 'code_gen'` executes as a columnar scan without loading embeddings.

Hybrid queries combine all three: retrieve the top-k vector neighbors, apply a SQL filter to restrict by namespace and date, re-rank by full-text match score. This is the retrieval pattern used by the BT's context-loading node when pre-populating the EWM at session start - giving the root model a curated view of the most relevant prior work before it sees the user's first message.

In our internal testing, pre-populating the EWM with three retrieved prior-session snapshots reduced root model decomposition errors by a measurable margin on complex multi-step tasks - the model was no longer reasoning from scratch about task structures it had already solved.

---

## Cost Per Work Unit

The unit economics of AI in production are poorly understood because most teams measure cost per API call, not cost per completed unit of work. A frontier model that handles a task in one call looks cheap until you realize it also handles the classification, the retrieval, the formatting, and the compliance check - all tasks a smaller specialist would have done at a fraction of the cost.

RLLM tracks Cost per Work Unit (CpWU) as a first-class metric, computed in `session_metadata` and queryable in KnowDB. A Work Unit is defined per deployment: in a broadcast ops context it might be "one scheduling decision resolved," in a healthcare admin context "one patient record lookup completed."

Because every model invocation is logged in `model_io` with token counts and specialist identity, the CpWU calculation is exact: sum all `model_io.input_tokens + model_io.output_tokens` for the session, multiply by the per-token cost of each specialist, divide by work units completed. The result is comparable across sessions, across specialists, and across time as the specialist roster changes.

In our CCCI deployment context, routing lower-complexity tasks to local 7B–13B specialists rather than escalating to API-hosted frontier models produces CpWU reductions of 60–80% on task types that do not require frontier-scale reasoning. The BT's fallback chain means this routing happens automatically, with no human intervention required.

---

## Compliance as Architecture, Not Policy

Policy-first compliance - write a document, configure a content filter, instruct the model to behave - depends on a black box honoring rules it can equally ignore. In regulated environments, that dependency is the risk.

RLLM and KnowDB treat compliance as a structural property of the system. The CodeComplianceGate sits inside the BT as a full node - the model passes through it the same way every other node does, with no pathway around it. The namespace architecture enforces data isolation at the schema level, making it a compile-time constraint rather than a runtime policy. The `bt_traces` table receives a write on every BT tick, before the next tick begins - its contents accumulate as an automatic consequence of the system running, with no opt-out.

When a CRTC auditor asks "what did your system do with that query on March 15th," the answer arrives as a KnowDB SQL query. The `bt_traces`, `model_io`, `gate_decisions`, and `ewm_snapshots` for that session are all versioned, immutable, and retrievable in seconds.

Cloud-hosted frontier model APIs require data to leave your infrastructure - a structural property of their architecture that audit logging cannot compensate for. RLLM's local-first design makes the audit structurally unavoidable: the records exist because the system ran, and they stay where the data originated.

---

## What's Next

The current KnowDB implementation supports single-organization deployments. We are building cross-organizational federation - allowing multiple RLLM deployments to share a KnowDB namespace under a consent-gated retrieval protocol, where one organization's session data is retrievable by another only if both parties have explicitly configured a bilateral retrieval agreement. This is the architecture for multi-organization AI collaboration without data centralization.

We are also building a BT template registry on top of KnowDB. Rather than every deployment authoring BTs from scratch, high-performing BT subtrees - identified by CpWU analysis across the `bt_traces` corpus - are promoted to a shared library. A new deployment can bootstrap from proven task structures rather than from a blank canvas.

RLLM and KnowDB are in active deployment at Crossroads Christian Communications Inc. (CCCI/YES TV) and available for evaluation by regulated-market organizations in broadcasting, healthcare administration, and defense-adjacent contexts.

If you are building AI systems where data sovereignty, auditability, and cost predictability are not optional, we would like to talk.

**Pierre Augé** - CTO, RecourseLLM | pierre@recourse.llm  
**Joel Augé** - CGO, RecourseLLM | joel@recourse.llm

---

*RLLM is built on `py_trees`, LanceDB OSS, and a local-first inference stack. KnowDB customizations are developed on top of the Apache 2.0–licensed LanceDB codebase.*
