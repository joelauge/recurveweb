import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play, X, Terminal, Shield, CheckCircle2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ContactForm from '../components/ContactForm';

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
                    <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', marginBottom: '32px' }}>
                        Intelligence, <br />
                        <span className="gradient-text">Optimized at the Source.</span>
                    </h1>
                    <p style={{ maxWidth: '800px', margin: '0 auto 48px', fontSize: '1.25rem', lineHeight: '1.6' }}>
                        The industry is scaling compute to solve the context problem. RecourseLLM solves the request.
                        By eliminating unnecessary tokens, we reduce the fundamental energy requirement of frontier reasoning.
                    </p>

                    <AnimatePresence mode="wait">
                        {!showForm ? (
                            <motion.div
                                key="actions"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}
                            >
                                <button onClick={() => setShowForm(true)} className="btn-premium">Enterprise Access <ChevronRight size={16} /></button>
                                <Link to="/architecture" className="btn-premium" style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', textDecoration: 'none' }}>
                                    Architecture
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

const ArchitecturePreview = () => (
    <section id="architecture" className="section-spacing">
        <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '24px' }}>Token Reduction as a Profit Center</h2>
            <p style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                Every token saved is compute deferred. While others are tackling the headroom problem by building more powerful compute architectures, RecourseLLM solves the fundamental first-principles problem: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>are all these tokens needed for every request?</span>
            </p>
            <div style={{ marginTop: '4rem', padding: '2rem', background: 'rgba(214,160,75,0.03)', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
                <div className="responsive-grid-medium" style={{ textAlign: 'left' }}>
                    <div>
                        <h4 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>The Headroom Approach</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Scaling H100 clusters to brute-force context windows. This increases capital and energy overhead linearly with performance.</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>The Recourse Approach</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Optimizing the request at the source. Recursive orchestration achieves frontier results while collapsing the <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Total Token Load (TTL)</span> requirement.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Stats = () => (
    <section id="performance" className="section-spacing" style={{ background: 'linear-gradient(to bottom, #030303, #000)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '6rem' }}>
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
                    RecourseLLM Token Usage Dashboard
                </p>
            </div>

            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>The Economics of Efficiency</h2>
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

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
    <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{children}</h2>
        {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>{subtitle}</p>}
    </div>
);

const TabbedCodeSnippet = ({ tabs }: { tabs: { label: string, code: string }[] }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(tabs[activeTab].code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ background: '#0a0a0a', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        style={{
                            background: activeTab === idx ? 'rgba(214,160,75,0.1)' : 'transparent',
                            color: activeTab === idx ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            border: 'none',
                            borderBottom: activeTab === idx ? '2px solid var(--accent-primary)' : '2px solid transparent',
                            padding: '12px 24px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: activeTab === idx ? 600 : 400,
                            transition: 'all 0.2s ease',
                            outline: 'none'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <code style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: '#fff', wordBreak: 'break-all' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>$</span> {tabs[activeTab].code}
                </code>
                <button
                    onClick={handleCopy}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: '#fff',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {copied ? <CheckCircle2 size={16} color="var(--accent-primary)" /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
        </div>
    );
};

const QuickStart = () => (
    <section className="section-spacing" style={{ position: 'relative' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
            <SectionTitle subtitle="Works on macOS, Windows & Linux. Installs dependencies and hooks directly into your IDE.">
                Quick Start
            </SectionTitle>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <TabbedCodeSnippet tabs={[
                    { label: 'macOS', code: 'curl -fsSL https://recoursellm.com/install.sh | bash' },
                    { label: 'Linux', code: 'curl -fsSL https://recoursellm.com/install.sh | bash' },
                    { label: 'Windows', code: 'iwr -useb https://recoursellm.com/install.ps1 | iex' },
                ]} />
                <div style={{ display: 'flex', gap: '20px', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Terminal size={16} color="var(--accent-primary)" /> Requires curl & bash
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Shield size={16} color="var(--accent-primary)" /> Safe network execution
                    </span>
                </div>
            </motion.div>
        </div>
    </section>
);

const ContextIsACrutch = () => (
    <section className="section-spacing">
        <div className="container">
            <div className="two-col-grid">
                <div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
                        Massive Context is a <span style={{ color: 'var(--accent-primary)' }}>Crutch.</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                        The industry is brute-forcing intelligence by shoving 100K+ tokens into massive cloud models. This scaling law is financially and ecologically unsustainable.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                        RecourseLLM treats the codebase as an external environment, not a static prompt. By implementing intelligent task orchestration instead of massive prompt injection, we communicate with the same models you use every day in a fundamentally different way.
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            'Dual-Instance Local Architecture (8B Gen / 0.6B Analysis)',
                            'Deterministic Behavior Tree Orchestration',
                            'Zenoh Real-Time Context Synchronization',
                        ].map((item, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontWeight: 500 }}>
                                <CheckCircle2 size={20} color="var(--accent-primary)" /> {item}
                            </li>
                        ))}
                    </ul>
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

const Home = () => {
    return (
        <main>
            <Hero />
            <DemoPlayer />
            <QuickStart />
            <ContextIsACrutch />
            <ArchitecturePreview />
            <Stats />
        </main>
    );
};

export default Home;
