import { motion } from 'framer-motion';
import { Shield, GitBranch, RefreshCw, Terminal, Share2, Activity, Box, Layers, Database, Lock, Wrench, Zap } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
    <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{children}</h2>
        {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>{subtitle}</p>}
    </div>
);

const TechCard = ({ icon: Icon, title, description, items }: { icon: any, title: string, description: string, items?: string[] }) => (
    <div className="glass-card" style={{ height: '100%' }}>
        <Icon size={32} color="var(--accent-primary)" style={{ marginBottom: '1.5rem' }} />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{description}</p>
        {items && (
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {items.map((item, i) => (
                    <li key={i} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                        {item}
                    </li>
                ))}
            </ul>
        )}
    </div>
);

const Architecture = () => {
    usePageMeta({
        title: 'RecourseLLM Architecture | The Orchestrated Environment',
        description: 'Discover how RecourseLLM inverts the AI paradigm with an orchestrated environment. 2000 tokens/sec, dual-instance scaling, and ZERO data flowing up.'
    });

    return (
        <div style={{ paddingTop: '120px', paddingBottom: '8rem' }}>
            <header style={{ paddingBottom: '4rem', textAlign: 'center' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <img
                            src="/recourse_logo_colour.png"
                            alt="RecourseLLM Logo"
                            style={{ height: '32px', width: 'auto', marginBottom: '24px', display: 'inline-block' }}
                        />
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem' }}>
                            <span className="gradient-text">Architecture</span>
                        </h1>
                        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                            RecourseLLM inverts the standard paradigm: context lives completely outside the model in an orchestrated environment, not inside a context window.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Hero Visual */}
            <div style={{ maxWidth: '100vw', overflow: 'hidden', padding: '2rem 0 6rem' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <img
                        src="/recursive_architecture_diagram.png"
                        alt="Recursive Architecture Diagram"
                        style={{
                            width: '100%',
                            maxWidth: '1000px',
                            borderRadius: '24px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                            border: '1px solid var(--border-subtle)',
                            margin: '0 auto'
                        }}
                    />
                </div>
            </div>

            {/* The Orchestrated Environment */}
            <section className="section-spacing" style={{ background: 'rgba(214,160,75,0.02)', position: 'relative' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
                            The <span style={{ color: 'var(--accent-primary)' }}>Orchestrated</span> Environment
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto' }}>
                            The golden rule of RecourseLLM is simple: <strong style={{ color: 'var(--text-primary)' }}>Data never flows up.</strong> The model receives semantic references and metadata—never the full raw data. It manipulates this data externally by generating code within a secure, dynamically coordinated environment.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>

                        {/* Working Memory */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'rgba(214,160,75,0.1)', padding: '1rem', borderRadius: '12px' }}>
                                <Database size={28} color="var(--accent-primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>External Working Memory</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    The foundation where all context variables, documents, and intermediate states reside. The model can search and reference these variables semantically, bypassing the need to ever load them into its context window.
                                </p>
                            </div>
                        </div>

                        {/* Execution */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'rgba(214,160,75,0.1)', padding: '1rem', borderRadius: '12px' }}>
                                <Lock size={28} color="var(--accent-primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Sandboxed Execution Runtime</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    A programmatic, secure environment where the model generates and executes code. Code carries operations, not data, safely manipulating the external memory with timeout protection and restricted access.
                                </p>
                            </div>
                        </div>

                        {/* Capabilities */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'rgba(214,160,75,0.1)', padding: '1rem', borderRadius: '12px' }}>
                                <Wrench size={28} color="var(--accent-primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>On-Demand Capabilities</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    Dozens of capability primitives injected as needed. Instead of bloating the system prompt, tools are discovered semantically at runtime. Results from operations are written directly back to the working memory.
                                </p>
                            </div>
                        </div>

                        {/* Skills */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'rgba(214,160,75,0.1)', padding: '1rem', borderRadius: '12px' }}>
                                <Layers size={28} color="var(--accent-primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Composable Logic Protocols</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    Complex, reusable operational sequences built from fundamental routines. Protocols can dispatch secondary agents or run sophisticated code analysis—all while keeping data flows strict. The system can even evolve and register new capabilities on the fly.
                                </p>
                            </div>
                        </div>

                        {/* Orchestration */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--accent-primary)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', boxShadow: '0 0 30px rgba(214,160,75,0.05)' }}>
                            <div style={{ background: 'var(--accent-primary)', padding: '1rem', borderRadius: '12px' }}>
                                <GitBranch size={28} color="#000" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Reactive Orchestration</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    The entire environment is coordinated by dynamic execution trees. These structures provide explicit control flow, managing parallel task operations, specialized processing, and fallback mechanisms when facing ambiguity.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Dual-Instance Dive */}
            <section className="section-spacing">
                <div className="container">
                    <div className="two-col-grid">
                        <div>
                            <SectionTitle subtitle="Optimizing for both complexity and speed by splitting workloads across specialized model instances.">
                                Dual-Instance Infrastructure
                            </SectionTitle>
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Root Instance (8B Model)</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>Focused on complex code generation and high-level strategy. It handles full context understanding and orchestrates where sub-tasks belong.</p>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Recursive Instance (0.6B Model)</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>Fast, low-latency analysis model. Handles massive volumes of parallel delegation tasks in our external environment, processing at lightning speeds.</p>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>
                                <li style={{ marginBottom: '12px', display: 'flex', gap: '10px' }}><Zap size={20} color="var(--accent-primary)" /> 3-5x faster parallel processing</li>
                                <li style={{ marginBottom: '12px', display: 'flex', gap: '10px' }}><Zap size={20} color="var(--accent-primary)" /> ~10GB VRAM total footprint for frontier performance</li>
                            </ul>
                        </div>
                        <div className="glass-card" style={{ padding: '2rem', background: '#050505', display: 'flex', alignItems: 'center' }}>
                            <img
                                src="/dual_instance_architecture.png"
                                alt="Dual Instance Architecture"
                                style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Behavior Trees */}
            <section className="section-spacing" style={{ background: 'rgba(214,160,75,0.02)' }}>
                <div className="container">
                    <SectionTitle subtitle="Complex behaviors built from simple, reusable logic nodes with explicit state tracking for reactive intelligence.">
                        Behavior Tree Control Flow
                    </SectionTitle>
                    <div className="responsive-grid-large" style={{ gap: '24px' }}>
                        <TechCard
                            icon={Box}
                            title="Control Flow Logic"
                            description="Sequence, Selector, and Parallel nodes manage task decomposition, allowing the AI to logically route its own actions."
                        />
                        <TechCard
                            icon={Activity}
                            title="Explicit Execution State"
                            description="Every logic node returns SUCCESS, FAILURE, or RUNNING, ensuring robust error handling and intelligent retries."
                        />
                        <TechCard
                            icon={GitBranch}
                            title="Domain Processing"
                            description="Trees coordinate deep dives on domain-specific workloads—from codebases to legal documents—without flooding context."
                        />
                    </div>

                    <div className="glass-card" style={{ marginTop: '3rem', padding: '0', overflow: 'hidden', background: '#0a0a0a' }}>
                        <div style={{ padding: '1.25rem 2rem', background: '#111', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                            </div>
                            <span style={{ fontSize: '12px', color: '#888', fontFamily: 'monospace', letterSpacing: '0.05em' }}>ORCHESTRATOR VISUALIZATION</span>
                        </div>
                        <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6' }}>
                            <div style={{ color: '#888', marginBottom: '8px' }}># Executing Recursive Task Decomposition</div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <span style={{ color: '#d6a04b', fontWeight: 600 }}>[RUNNING]</span>
                                <span style={{ color: '#fff' }}>Root_Selector: Process Workload</span>
                            </div>
                            <div style={{ paddingLeft: '2rem' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <span style={{ color: '#27c93f', fontWeight: 600 }}>[SUCCESS]</span>
                                    <span style={{ color: '#fff' }}>Worker_0: Extract Key Definitions</span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <span style={{ color: '#d6a04b', fontWeight: 600 }}>[RUNNING]</span>
                                    <span style={{ color: '#fff' }}>Worker_1: Validate Dependencies</span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', opacity: 0.5 }}>
                                    <span style={{ color: '#444', fontWeight: 600 }}>[PENDING]</span>
                                    <span style={{ color: '#444' }}>Worker_2: Generate Code Diff</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Zenoh Integration */}
            <section className="section-spacing">
                <div className="container">
                    <SectionTitle subtitle="Distributed context synchronization across all components with ultra-low latency.">
                        Real-Time Telemetry
                    </SectionTitle>
                    <div className="zenoh-grid" style={{ alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                                RecourseLLM utilizes powerful pub/sub systems to maintain a real-time, shared understanding of the environment state. Changes anywhere in the system are immediately reflected and accessible.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                                <div>
                                    <h5 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>ON-DEMAND SYNC</h5>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Dynamically retrieves only what is needed directly from source, never pre-loading static memory.</p>
                                </div>
                                <div>
                                    <h5 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>HYPER-SCALABLE</h5>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Operates across thousands of nested files with unnoticeable latency overhead to the orchestration tree.</p>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 2rem' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                    style={{ position: 'absolute', inset: 0, border: '2px dashed var(--accent-primary)', borderRadius: '50%', opacity: 0.3 }}
                                />
                                <div style={{ position: 'absolute', inset: '20px', background: 'rgba(214,160,75,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Share2 size={40} color="var(--accent-primary)" />
                                </div>
                            </div>
                            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Distributed Bus</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>\u003C 1ms State Sync Latency</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance Characteristics */}
            <section className="section-spacing">
                <div className="container">
                    <SectionTitle subtitle="Benchmarks and resource requirements for typical RecourseLLM deployments.">
                        Performance & Resources
                    </SectionTitle>
                    <div className="stats-grid">
                        <div className="glass-card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>1500-2000</div>
                            <div style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.1em' }}>TOKENS / SEC</div>
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Combined dual-instance throughput across multiple slots.</p>
                        </div>
                        <div className="glass-card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>~10GB</div>
                            <div style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.1em' }}>VRAM FOOTPRINT</div>
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total memory usage for Root (8B) and Worker (0.6B) models.</p>
                        </div>
                        <div className="glass-card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{'<'} 1%</div>
                            <div style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.1em' }}>CPU OVERHEAD</div>
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Minimal system impact while offloading inference to GPU.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fault Tolerance Section */}
            <section className="section-spacing">
                <div className="container">
                    <div className="two-col-grid">
                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <img
                                src="/distributed_ai_nodes.png"
                                alt="Distributed AI Nodes"
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                        <div>
                            <Shield size={64} color="var(--accent-primary)" style={{ marginBottom: '2rem' }} />
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Fault Tolerance by Design</h2>
                            <p style={{ fontSize: '1.1rem', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
                                RecourseLLM doesn't just manage models; it monitors their health. Continuous heartbeat checks and soft/hard recovery patterns ensure that inference failures never block critical workloads.
                            </p>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', flex: 1 }}>
                                    <RefreshCw size={24} color="var(--accent-primary)" style={{ marginBottom: '8px' }} />
                                    <div style={{ fontWeight: 600 }}>Soft Recovery</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cache Reset</div>
                                </div>
                                <div style={{ padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', flex: 1 }}>
                                    <Terminal size={24} color="var(--accent-primary)" style={{ marginBottom: '8px' }} />
                                    <div style={{ fontWeight: 600 }}>Hard Recovery</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Process Restart</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Architecture;
