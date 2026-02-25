import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play, X, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ContactForm from '../components/ContactForm';
import { usePageMeta } from '../hooks/usePageMeta';

const Hero = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <header style={{ textAlign: 'center', paddingTop: '12rem', paddingBottom: '8rem' }}>
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
                    <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: '32px', lineHeight: '1.1' }}>
                        Give your AI a whole world.<br />
                        <span className="gradient-text">Not just a window.</span>
                    </h1>
                    <p style={{ maxWidth: '800px', margin: '0 auto 48px', fontSize: '1.25rem', lineHeight: '1.6' }}>
                        RecourseLLM keeps your data in an external environment the model operates on, not inside a context window it's limited by.
                    </p>

                    <AnimatePresence mode="wait">
                        {!showForm ? (
                            <motion.div
                                key="actions"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
                            >
                                <button onClick={() => setShowForm(true)} className="btn-premium">See it in action <ChevronRight size={16} /></button>
                                <Link to="/architecture" className="btn-premium" style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', textDecoration: 'none' }}>
                                    Read the architecture
                                </Link>
                            </motion.div>
                        ) : (
                            <ContactForm onClose={() => setShowForm(false)} />
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </header>
    );
};

const ContextIsACrutch = () => (
    <section className="section-spacing">
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
                Massive Context is a <span style={{ color: 'var(--accent-primary)' }}>Crutch.</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                The context window isn't just expensive. It's a ceiling on what AI can actually do. Documents too large to load. Sessions that forget everything. Worlds that reset. Rules that hallucinate.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                The industry's answer is bigger windows. Ours is to not need them. Reconceptualizing the codebase as an external environment, not a static prompt, makes entire categories of applications possible.
            </p>
        </div>
    </section>
);

const TheInversion = () => (
    <section className="section-spacing" style={{ position: 'relative' }}>
        <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
                The <span style={{ color: 'var(--accent-primary)' }}>Inversion.</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto 4rem' }}>
                Instead of loading your data into a model's context window, we deploy the model into your data's environment. Data stays outside. Intelligence operates within. No ceiling.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '2.5rem', border: '1px solid var(--border-subtle)', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', width: '320px', textAlign: 'left' }}>
                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.2rem', textAlign: 'center' }}>Traditional AI</h4>
                    <div style={{ border: '1px solid rgba(255,100,100,0.3)', borderRadius: '12px', padding: '1.5rem', background: 'rgba(255,100,100,0.05)' }}>
                        <div style={{ color: '#ff4d4d', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>Context Window</div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>Instruction Prompt</div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginTop: '0.75rem', textAlign: 'center', opacity: 0.7 }}>Your Data (Hits Limit)</div>
                    </div>
                </div>

                <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={48} className="hide-on-mobile" />
                </div>

                <div style={{ padding: '2.5rem', border: '1px solid var(--accent-primary)', borderRadius: '16px', background: 'rgba(214,160,75,0.05)', width: '320px', textAlign: 'left', boxShadow: '0 0 40px rgba(214,160,75,0.1)' }}>
                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem', fontSize: '1.2rem', textAlign: 'center' }}>RecourseLLM</h4>
                    <div style={{ border: '1px dashed var(--accent-primary)', borderRadius: '12px', padding: '1.5rem', background: 'transparent' }}>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>External Environment</div>
                        <div style={{ background: 'var(--accent-primary)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', color: '#000', fontWeight: 600, textAlign: 'center', boxShadow: '0 4px 12px rgba(214,160,75,0.3)' }}>Model Operating</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem', textAlign: 'center' }}>Infinite Data</div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem', textAlign: 'center' }}>Infinite Data</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const WhatItEnables = () => (
    <section className="section-spacing" style={{ position: 'relative', background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>What Becomes <span style={{ color: 'var(--accent-primary)' }}>Possible.</span></h2>
            </div>
            <div className="stats-grid">
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Gaming</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-secondary)' }}>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} /> NPCs that remember.</li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Worlds that evolve.</li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Rules that execute deterministically.</li>
                    </ul>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Enterprise</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-secondary)' }}>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Document portfolios analyzed without loading.</li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Sessions that persist across weeks.</li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Parallel workstreams on shared data.</li>
                    </ul>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Engineering</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-secondary)' }}>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Codebases operated on at scale.</li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Refactoring across 200k lines.</li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Tests generated across entire monorepos.</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

const HowItWorks = () => (
    <section id="architecture" className="section-spacing">
        <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '24px' }}>How It Works</h2>
            <p style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                While others are tackling the headroom problem by building more powerful compute architectures, RecourseLLM asks a first-principles question: <br /><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>How <i>exactly</i> should we spend our intelligence?</span>
                <br />We believe we should spend it with <i>exacting precision</i>.
            </p>

            <div style={{ marginTop: '4rem', marginBottom: '6rem' }}>
                <img
                    src="/recourse_screenshot.jpg"
                    alt="RecourseLLM Token Usage Dashboard"
                    style={{
                        width: '100%',
                        maxWidth: '1000px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        margin: '0 auto'
                    }}
                />
                <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '1rem', fontStyle: 'italic' }}>
                    Live token load comparison execution via local dashboard.
                </p>
            </div>

            <div style={{ padding: '2rem', background: 'rgba(214,160,75,0.03)', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
                <div className="responsive-grid-medium" style={{ textAlign: 'left' }}>
                    <div>
                        <h4 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>The Headroom Approach</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Scaling H100 clusters to brute-force context windows. This increases capital and energy overhead linearly with performance. Every execution starts from a blank slate.</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>The Recourse Approach</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Optimizing the request at the source. Recursive orchestration allows an autonomous system to persist state and achieve frontier results while collapsing the <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Total Token Load (TTL)</span>.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const TokenByproduct = () => (
    <section className="section-spacing">
        <div className="container">
            <div className="two-col-grid" style={{ alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
                        Token Reduction is a <span style={{ color: 'var(--accent-primary)' }}>Byproduct.</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                        The byproduct of building this right is 98% token reduction. The point is doing things that were previously impossible.
                    </p>
                </div>
                <div style={{ background: 'rgba(214,160,75,0.05)', borderRadius: '24px', padding: '3rem', border: '1px solid rgba(214,160,75,0.2)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)' }} />
                    <h4 style={{ color: '#fff', marginBottom: '2rem', fontSize: '1.2rem', textAlign: 'center' }}>Token Cost per Complex SWE Task</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Standard RAG (70B)</span>
                                <span style={{ color: '#fff', fontWeight: 'bold' }}>~1.2M Tokens</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} style={{ height: '100%', background: '#ff4d4d' }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Agentic Loop (32B)</span>
                                <span style={{ color: '#fff', fontWeight: 'bold' }}>~450K Tokens</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <motion.div initial={{ width: 0 }} whileInView={{ width: '40%' }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }} style={{ height: '100%', background: '#ffb84d' }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>RecourseLLM (8B + 0.6B)</span>
                                <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>~25K Tokens</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                                <motion.div initial={{ width: 0 }} whileInView={{ width: '5%' }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.6 }} style={{ height: '100%', background: 'var(--accent-primary)' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Stats = () => (
    <section id="performance" className="section-spacing" style={{ background: 'linear-gradient(to bottom, transparent, #000)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>The Economics of Efficiency</h2>
            <div className="stats-grid">
                <div>
                    <div style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>80%</div>
                    <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-primary)' }}>Energy Reduction</p>
                </div>
                <div>
                    <div style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>$120M</div>
                    <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-primary)' }}>Scale Savings</p>
                </div>
                <div>
                    <div style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>4.2x</div>
                    <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-primary)' }}>Compute ROI Increase</p>
                </div>
            </div>
            <p style={{ marginTop: '3rem', maxWidth: '700px', margin: '3rem auto 0', color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                *Based on a $0.12/kWh baseline and 1B+ token monthly workloads. Reducing tokens is the only sustainable path to energy-positive AGI deployment.
            </p>
        </div>
    </section>
);

const DemoPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="container" style={{ textAlign: 'center', marginTop: '-2rem', marginBottom: '4rem', zIndex: 10, position: 'relative' }}>
            <motion.div
                layout
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: isPlaying ? '1000px' : '600px',
                    margin: '0 auto',
                    aspectRatio: '16/9',
                    background: '#0a0a0a',
                    borderRadius: '24px',
                    border: '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    transition: 'max-width 0.5s ease'
                }}
            >
                <AnimatePresence>
                    {!isPlaying ? (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <video
                                src="/recourseloader.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                            />
                            <div style={{ position: 'absolute', top: '75%', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <button
                                    onClick={() => setIsPlaying(true)}
                                    className="btn-premium"
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Play size={16} fill="currentColor" /> What is RecourseLLM?
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="video"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ position: 'absolute', inset: 0 }}
                        >
                            <button
                                onClick={() => setIsPlaying(false)}
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    zIndex: 10,
                                    background: 'rgba(0,0,0,0.5)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(4px)'
                                }}
                            >
                                <X size={16} />
                            </button>
                            <iframe
                                src="https://www.youtube.com/embed/0Ha6yC_2FG0?autoplay=1&mute=0&rel=0"
                                title="RecourseLLM Demo"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
};

const ClosingCTA = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <section className="section-spacing" style={{ borderTop: '1px solid var(--border-subtle)', background: 'linear-gradient(to bottom, transparent, rgba(214,160,75,0.02))' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Ready to escape the context window?</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
                    Choose your path based on your use case.
                </p>
                <div className="three-col-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'left' }}>
                    <div style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Enterprise</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', minHeight: '3rem' }}>Deploy RecourseLLM on your own infrastructure for unlimited document analysis.</p>
                        <button onClick={() => setShowForm(true)} className="btn-premium" style={{ width: '100%', justifyContent: 'center' }}>Book a Demo</button>
                    </div>
                    <div style={{ padding: '2.5rem', background: 'rgba(214,160,75,0.05)', borderRadius: '24px', border: '1px solid rgba(214,160,75,0.2)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-primary)' }} />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Gaming & Dev</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', minHeight: '3rem' }}>Get early access to our dynamic environment engines and local REPL.</p>
                        <button onClick={() => setShowForm(true)} className="btn-premium" style={{ width: '100%', justifyContent: 'center', background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}>Join the Beta</button>
                    </div>
                    <div style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Technical</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', minHeight: '3rem' }}>Read the whitepaper and explore the dual-model orchestration architecture.</p>
                        <Link to="/architecture" className="btn-premium" style={{ width: '100%', display: 'flex', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', textDecoration: 'none' }}>Read Architecture</Link>
                    </div>
                </div>

                <AnimatePresence>
                    {showForm && <ContactForm onClose={() => setShowForm(false)} />}
                </AnimatePresence>
            </div>
        </section>
    );
};

const Home = () => {
    usePageMeta({
        title: 'RecourseLLM | Intelligence, Optimized at the Source.',
        description: 'Escape the context window. RecourseLLM delivers industrial-grade context orchestration, unlocking infinite memory and 1500-2000 tokens/sec throughput.'
    });

    return (
        <main>
            <Hero />
            <ContextIsACrutch />
            <TheInversion />
            <WhatItEnables />
            <HowItWorks />
            <TokenByproduct />
            <Stats />
            <DemoPlayer />
            <ClosingCTA />
        </main>
    );
};

export default Home;
