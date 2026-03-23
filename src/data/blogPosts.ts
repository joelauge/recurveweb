export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  deck: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  content: any[]; // Array of blocks: paragraph, heading, quote, statRow, diagram, principleGrid
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'jensen-is-right',
    title: 'Jensen Is Right.',
    subtitle: "The Question Is What You're Spending On.",
    deck: "When Nvidia's CEO says engineers should burn $250K in AI tokens a year, he's making a resource allocation argument. What he leaves open is whether those tokens are doing intelligence work, or housekeeping.",
    author: 'Joel Augé - Co-Founder @ ReCourseLLM',
    date: 'March 2026',
    readTime: '8 min read',
    category: 'Engineering Blog',
    content: [
      {
        type: 'paragraph',
        text: "Jensen Huang made headlines in March 2026 when he told the All-In podcast that a software engineer earning $500,000 a year should be spending at least $250,000 annually on AI tokens. The analogy he reached for was chip designers who refused to use CAD tools: professionally negligent, he said, in an age where AI is progressing this fast."
      },
      {
        type: 'paragraph',
        text: "He's not wrong. The argument for investing heavily in AI tooling is sound. The engineers and organizations that learn to work with AI at high bandwidth, not as a parlor trick, but as a genuine operational multiplier, will outperform those who don't. That's not a controversial claim."
      },
      {
        type: 'paragraph',
        text: "But the framing stops short of the harder question: **what are those tokens actually doing when you spend them?**",
        isStrong: true
      },
      {
        type: 'pullQuote',
        text: "The goal isn't maximum token spend. It's maximum useful output per token. Those are not the same target, and optimizing for the wrong one is an expensive mistake."
      },
      {
        type: 'heading',
        level: 2,
        text: "The Hidden Tax Inside Every LLM Call"
      },
      {
        type: 'paragraph',
        text: "Before you can think clearly about token budgets, you need a working model of where tokens actually go. Most engineers and most teams don't have one. They see a bill at the end of the month and a set of outputs, and the gap between them is opaque."
      },
      {
        type: 'paragraph',
        text: "Here's what's happening inside a typical enterprise AI workflow with a standard LLM architecture:"
      },
      {
        type: 'paragraph',
        text: "Every call to the model begins with a full re-read. Your system prompt — which might contain hundreds of lines of instructions, context, role definitions, and behavioral constraints — gets fed in on every single invocation. Your conversation history, if you're maintaining one, gets fed in. Any documents you've attached get fed in. The model processes all of it, every time, before it generates a single token of output."
      },
      {
        type: 'paragraph',
        text: "This is not a bug. It's the architecture. Transformer models are stateless between calls. They don't remember your previous session. They don't cache the context you gave them an hour ago. You either re-supply it or it is gone."
      },
      {
        type: 'paragraph',
        text: "**on complex, long-running enterprise tasks, a significant fraction of your token spend is structural overhead,** not intelligence, not reasoning, and not output. It's the model re-reading the manual before it can answer your question.",
        isStrong: true
      },
      {
        type: 'tokenDiagram',
        label: 'Estimated token distribution — typical enterprise agent task',
        items: [
          { name: 'Standard RAG pipeline', val: '~1.2M tokens per complex task', waste: 65, signal: 35 },
          { name: 'Agentic loop with memory summarization', val: '~450K tokens', waste: 48, signal: 52 },
          { name: 'RLLM with Semantic Dictionary (Layer 0)', val: '~25K tokens', waste: 4, rllm: 96 }
        ]
      },
      {
        type: 'paragraph',
        text: "The waste column in that diagram isn't idleness. It's the model doing real computation on tokens that carry no new information: tokens it has already processed in prior calls, tokens that describe context that hasn't changed, and tokens that represent state the model is reconstructing because the architecture gives it no other way to access it."
      },
      {
        type: 'heading',
        level: 2,
        text: "Context Rot Is a Real Phenomenon"
      },
      {
        type: 'paragraph',
        text: "There's a second problem that's less discussed but arguably more serious: **context rot**."
      },
      {
        type: 'paragraph',
        text: "Transformer attention is not uniform across a context window. Research on positional encoding and attention weight distribution has consistently shown that tokens in the middle of a very long context receive systematically lower attention weights than tokens at the beginning or end. As your context window fills (and at 1M+ tokens, it fills fast), earlier information begins to decay in influence."
      },
      {
        type: 'paragraph',
        text: "This means that as your session grows, the model is not equally aware of everything you've told it. The architectural decision you documented in token 40,000 carries less weight in the model's reasoning by the time it's processing token 800,000. Your system prompt, padded deep into a long session, may be losing influence precisely when you need it most."
      },
      {
        type: 'paragraph',
        text: "Bigger context windows are a genuine improvement. They defer this problem. They don't solve it — because the problem is structural, not a matter of scale."
      },
      {
        type: 'pullQuote',
        text: "A 2M token window is a bigger room. RLLM is a different kind of building, one where the model doesn't have to hold the room in its head at all."
      },
      {
        type: 'heading',
        level: 2,
        text: "What Output-Per-Token Actually Measures"
      },
      {
        type: 'paragraph',
        text: "If Jensen's framework is \"spend more tokens,\" the operational question that follows is: *what do I have to show for them?*"
      },
      {
        type: 'paragraph',
        text: "Token spend is an input metric. What you actually care about is output quality, output velocity, and task completion rate at a given budget. These are the numbers that should drive your AI infrastructure decisions — not raw spend."
      },
      {
        type: 'paragraph',
        text: "There are three metrics worth tracking at the engineering level:"
      },
      {
        type: 'heading',
        level: 3,
        text: "01 — Reasoning token ratio"
      },
      {
        type: 'paragraph',
        text: "Of the total tokens consumed in a session, what percentage were spent on active reasoning (generating novel output, synthesizing information, making decisions) versus re-reading context, reconstructing state, or processing information the model had already seen? **A high reasoning ratio means your architecture is efficient.** A low one means you're paying for overhead."
      },
      {
        type: 'heading',
        level: 3,
        text: "02 — State reconstruction cost"
      },
      {
        type: 'paragraph',
        text: "How many tokens does your system spend, per session, on recovering information from previous sessions or from the beginning of the current one? In a standard stateless LLM architecture, this number is high by default because the model reconstructs from scratch every time. In an architecture with persistent external state, it approaches zero. The Semantic Dictionary writes state on assignment and retrieves it via semantic query: no reconstruction required, no tokens consumed on recall."
      },
      {
        type: 'heading',
        level: 3,
        text: "03 — Task completion per dollar"
      },
      {
        type: 'paragraph',
        text: "The ultimate measure. How many defined, completed tasks does your AI infrastructure produce per unit of spend? This is harder to measure but it's the only metric that actually connects to business value. Token spend is a cost line. Task completion is the revenue line. Optimizing for the former without measuring the latter is how teams end up with impressive invoices and mediocre outputs."
      },
      {
        type: 'statRow',
        stats: [
          { num: '98%', label: 'Token reduction on complex enterprise tasks vs. standard RAG' },
          { num: '0', label: 'Context tokens consumed on state recall with the Semantic Dictionary' },
          { num: '5', label: "Architectural layers between your task and the model's context window" }
        ]
      },
      {
        type: 'heading',
        level: 2,
        text: "The Architecture That Makes the Difference"
      },
      {
        type: 'paragraph',
        text: "RecourseLLM is a five-layer orchestration stack that sits above the inference layer. The key primitive is Layer 0: the Semantic Dictionary, a persistent external namespace backed by a vector store. When the agent assigns a variable (a document, a decision, a computed result, or a project state), it goes into the namespace. When the agent needs it later, it issues a semantic query and retrieves exactly what it needs."
      },
      {
        type: 'paragraph',
        text: "The model's context window, at any given moment, contains only the active reasoning step and a small set of retrieved variables, typically five to ten. It does not contain the full history of the session. It does not re-read the system prompt on every call. It does not reconstruct state from scratch."
      },
      {
        type: 'paragraph',
        text: "The result is that token consumption scales with the complexity of the *current step*, not with the total accumulated history of the task. A ten-hour enterprise research task does not cost ten times more than a one-hour task. The cost curve flattens because state is externalized, not held."
      },
      {
        type: 'principleGrid',
        principles: [
          { num: 'PRINCIPLE 01', title: 'State lives outside the window', text: 'Variables, decisions, and session history persist in the Semantic Dictionary namespace. The model queries what it needs per step. Nothing is re-read unnecessarily.' },
          { num: 'PRINCIPLE 02', title: 'Code executes, not re-prompts', text: 'Safe Containerized Environment lets the model operate on live objects via generated code. Tool calls become function calls. Token overhead per operation is near zero.' },
          { num: 'PRINCIPLE 03', title: 'Skills compound across sessions', text: 'The SkillRegistry accumulates capabilities at Layer 3. Skills written and registered in one session are available in the next — without re-supplying their implementation in the context window.' },
          { num: 'PRINCIPLE 04', title: 'Model-agnostic by design', text: 'The orchestration stack runs above the inference layer. Swap backends (Anthropic, OpenAI, Gemini, or Ollama) without changing architecture. Every model improvement becomes an RLLM improvement.' }
        ]
      },
      {
        type: 'heading',
        level: 2,
        text: "How to Think About Your AI Budget"
      },
      {
        type: 'paragraph',
        text: "Jensen's $250K number is a provocation more than a prescription. The underlying point (that AI tooling is a professional resource that should be invested in seriously and not treated as a novelty line item) is correct and important."
      },
      {
        type: 'paragraph',
        text: "But the operational implication isn't \"spend more.\" It's \"spend with measurement.\" Here's a practical framework for any team building on LLMs at scale:"
      },
      {
        type: 'paragraph',
        text: "**Instrument your token spend before you scale it.** Know, at the call level, what's overhead and what's reasoning. If you don't have this visibility, you're flying blind on your fastest-growing cost line.",
        isStrong: true
      },
      {
        type: 'paragraph',
        text: "**Identify your highest-volume context reconstruction patterns.** What information does your system re-read most often? What state does it reconstruct from scratch on every call? These are the first candidates for externalization.",
        isStrong: true
      },
      {
        type: 'paragraph',
        text: "**Measure task completion, not just task initiation.** An AI that starts ten tasks and completes seven is more operationally valuable than one that starts ten and completes three faster. Completion rate at a given token budget is the metric that connects to business outcomes.",
        isStrong: true
      },
      {
        type: 'paragraph',
        text: "**Then scale.** Once you have a system that produces high reasoning-token ratios, low reconstruction overhead, and measurable task completion rates — then Jensen's prescription makes sense. At that point, spending more tokens genuinely produces more output. Before that point, you're scaling inefficiency."
      },
      {
        type: 'paragraph',
        text: "The engineers and organizations who get this right will look, from the outside, like they've discovered a different kind of leverage. They haven't. They've just gotten serious about the infrastructure that turns token spend into work done."
      },
      {
        type: 'cta',
        text: "\"Give AI a World. Not a Window.\"",
        link: "https://recoursellm.com/installation",
        linkText: "Deploy the stack → recoursellm.com"
      }
    ]
  }
];
