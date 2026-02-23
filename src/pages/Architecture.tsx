import { motion } from 'framer-motion';
import { Cpu, Shield, GitBranch, RefreshCw, Terminal, Share2, Activity, Box } from 'lucide-react';

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
                            An overview of RecourseLLM's system architecture, including core REPL execution, behavior tree orchestration, and distributed context management.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Hero Visual */}
            <div style={{ maxWidth: '100vw', overflow: 'hidden', padding: '2rem 0 6rem' }}>
                <div className="container">
                    <img
                        src="/recursive_architecture_diagram.png"
                        alt="Recursive Architecture Diagram"
                        style={{
                            width: '100%',
                            borderRadius: '24px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                            border: '1px solid var(--border-subtle)'
                        }}
                    />
                </div>
            </div>

            {/* System Overview */}
            <section className="section-spacing">
                <div className="container">
                    <SectionTitle subtitle="RecourseLLM uses small models to redefine context management and orchestration to save immense numbers of tokens while delivering frontier-level execution of tasks.">
                        System Overview
                    </SectionTitle>
                    <div className="responsive-grid-medium">
                        <TechCard
                            icon={Terminal}
                            title="REPL-Based Execution"
                            description="Treats large documents as an external environment to be examined programmatically rather than ingested into context."
                        />
                        <TechCard
                            icon={GitBranch}
                            title="BT Orchestration"
                            description="Robust, modular control flow with explicit state tracking for complex, multi-step reasoning tasks."
                        />
                        <TechCard
                            icon={Cpu}
                            title="Dual-Instance Optimization"
                            description="Task-optimized models for generation and analysis, maximizing throughput and VRAM efficiency."
                        />
                        <TechCard
                            icon={Share2}
                            title="Zenoh Context Sync"
                            description="Real-time workspace synchronization across distributed components using high-performance pub/sub."
                        />
                    </div>
                </div>
            </section>

            {/* Dual-Instance Dive */}
            <section className="section-spacing" style={{ background: 'rgba(214,160,75,0.02)' }}>
                <div className="container">
                    <div className="two-col-grid">
                        <div>
                            <SectionTitle subtitle="Optimizing for both complexity and speed by splitting workloads across specialized model instances.">
                                Dual-Instance Infrastructure
                            </SectionTitle>
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Root Instance (8B Model)</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>Focused on complex code generation and high-level reasoning. Optimized for 32K context with high-precision quantization.</p>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Recursive Instance (0.6B Model)</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>Fast, low-latency analysis model. Handles massive volumes of sub-RLM calls in parallel across multiple inference slots.</p>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>
                                <li style={{ marginBottom: '12px', display: 'flex', gap: '10px' }}><CheckCircle2 size={20} color="var(--accent-primary)" /> 3-5x faster parallel processing</li>
                                <li style={{ marginBottom: '12px', display: 'flex', gap: '10px' }}><CheckCircle2 size={20} color="var(--accent-primary)" /> ~10GB VRAM footprint for frontier performance</li>
                            </ul>
                        </div>
                        <div className="glass-card" style={{ padding: '2rem', background: '#050505' }}>
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
            <section className="section-spacing">
                <div className="container">
                    <SectionTitle subtitle="Complex behaviors built from simple, reusable nodes with explicit state tracking and Visual Debugging.">
                        Behavior Tree Orchestration
                    </SectionTitle>
                    <div className="responsive-grid-large" style={{ gap: '24px' }}>
                        <TechCard
                            icon={Box}
                            title="Control Flow Nodes"
                            description="Sequence, Selector, and Parallel nodes manage the logic of task decomposition and error recovery."
                        />
                        <TechCard
                            icon={Activity}
                            title="Explicit State"
                            description="Every node returns SUCCESS, FAILURE, or RUNNING, allowing for granular control over the execution lifecycle."
                        />
                        <TechCard
                            icon={Shield}
                            title="SafeREPL Sandboxing"
                            description="A programmatic environment for executing model-generated code safely with optional network and FS restrictions."
                        />
                    </div>

                    <div className="glass-card" style={{ marginTop: '3rem', padding: '0', overflow: 'hidden', background: '#0a0a0a' }}>
                        <div style={{ padding: '1.25rem 2rem', background: '#111', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                            </div>
                            <span style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>BT_ORCHESTRATOR_v2.PY</span>
                        </div>
                        <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6' }}>
                            <div style={{ color: '#888' }}># Executing Recursive Task Decomposition</div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <span style={{ color: '#d6a04b' }}>[RUNNING]</span>
                                <span style={{ color: '#fff' }}>Root: Analyze Workflow</span>
                            </div>
                            <div style={{ paddingLeft: '2rem' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <span style={{ color: '#27c93f' }}>[SUCCESS]</span>
                                    <span style={{ color: '#fff' }}>Worker_0: Extract Schema</span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <span style={{ color: '#d6a04b' }}>[RUNNING]</span>
                                    <span style={{ color: '#fff' }}>Worker_1: Validate Logic</span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', opacity: 0.5 }}>
                                    <span style={{ color: '#444' }}>[PENDING]</span>
                                    <span style={{ color: '#444' }}>Worker_2: Generate Diffs</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Zenoh Integration */}
            <section className="section-spacing" style={{ background: 'linear-gradient(to bottom, transparent, rgba(214,160,75,0.02))' }}>
                <div className="container">
                    <SectionTitle subtitle="Distributed context synchronization across all components with ultra-low latency.">
                        Zenoh Distributed Context
                    </SectionTitle>
                    <div className="zenoh-grid">
                        <div>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '2rem' }}>
                                RecourseLLM integrates Zenoh to maintain a real-time, shared understanding of the workspace. As files change in VSCode, the context is instantly published and synced to the inference engine.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                                <div>
                                    <h5 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>SMART SYNC</h5>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Prioritizes key files, recently modified modules, and configuration entry points.</p>
                                </div>
                                <div>
                                    <h5 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>FULL MODE</h5>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Scales up to 500+ files with respect to max context limits and token efficiency.</p>
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
                            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Zenoh Router</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>\u003C 1ms Context Latency</div>
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
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>10-100</div>
                            <div style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.1em' }}>TOKENS / SEC</div>
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Combined dual-instance throughput across multiple slots.</p>
                        </div>
                        <div className="glass-card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>~10GB</div>
                            <div style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.1em' }}>VRAM FOOTPRINT</div>
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total memory usage for Root (8B) and Worker (0.6B) models.</p>
                        </div>
                        <div className="glass-card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>\u003C 1%</div>
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

const CheckCircle2 = ({ size, color }: { size: number, color: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
