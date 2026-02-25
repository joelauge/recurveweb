import { motion } from 'framer-motion';
import { Terminal, Shield, Cpu, Globe, Zap, Box, Copy, CheckCircle2, Search, X } from 'lucide-react';
import { useState } from 'react';
import librariesData from '../assets/pythonLibraries.json';
import { usePageMeta } from '../hooks/usePageMeta';

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
    <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{children}</h2>
        {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>{subtitle}</p>}
    </div>
);

const TechCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Icon size={32} color="var(--accent-primary)" style={{ marginBottom: '1.5rem' }} />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', flex: 1 }}>{description}</p>
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

const CategoryBlock = ({ categoryName, libraries }: { categoryName: string, libraries: { name: string, desc: string }[] }) => {
    return (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '450px' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.4)', zIndex: 1 }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', margin: 0 }}>{categoryName}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', marginTop: '0.25rem', opacity: 0.8 }}>{libraries.length} libraries</div>
            </div>
            <div className="custom-scrollbar" style={{ overflowY: 'auto', flex: 1, paddingBottom: '1rem' }}>
                {libraries.map((lib, idx) => (
                    <AccordionItem key={lib.name + idx} title={lib.name} description={lib.desc} index={idx} />
                ))}
            </div>
        </div>
    );
};

const AccordionItem = ({ title, description, index }: { title: string, description: string, index: number }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem 1.5rem',
                    background: isOpen ? 'rgba(214,160,75,0.05)' : 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    outline: 'none',
                    textAlign: 'left',
                    transition: 'background 0.2s ease'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontFamily: 'monospace', opacity: 0.8 }}>
                        {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <span style={{ fontWeight: 500, fontSize: '1.1rem', letterSpacing: '0.01em' }}>{title}</span>
                </div>
                <div style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: 'var(--text-secondary)'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </button>
            <div style={{
                height: isOpen ? 'auto' : 0,
                overflow: 'hidden',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ padding: '0 1.5rem 1.5rem 4rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {description}
                </div>
            </div>
        </div>
    );
};

const Installation = () => {
    usePageMeta({
        title: 'RecourseLLM Installation | Deploy the Environment',
        description: 'Get started with RecourseLLM. Step-by-step guide to installing the agent runtime, configuring the distributed telemetry, and escaping the context window.'
    });

    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = Object.entries(librariesData).map(([categoryName, libraries]) => {
        const filteredLibs = libraries.filter(lib =>
            lib.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lib.desc.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return { categoryName, libraries: filteredLibs };
    }).filter(category => category.libraries.length > 0);

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
                            <span className="gradient-text">Install into your IDE</span>
                        </h1>
                        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                            RecourseLLM integrates directly into your environment. A single command sets up everything you need to start operating beyond standard context limits.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Quickstart Section */}
            <section className="section-spacing" style={{ position: 'relative' }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 10,
                    backdropFilter: 'blur(2px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.4)'
                }}>
                    <div style={{ padding: '1rem 2rem', background: 'rgba(214,160,75,0.1)', border: '1px solid var(--accent-primary)', borderRadius: '12px', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '1.2rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Coming Soon
                    </div>
                </div>
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

            {/* What It Does Section */}
            <section className="section-spacing" style={{ background: 'linear-gradient(to bottom, transparent, rgba(214,160,75,0.02))' }}>
                <div className="container">
                    <SectionTitle subtitle="Once installed, RecourseLLM acts as an intelligent operating system primitive, extending its reach through your machine.">
                        What It Does
                    </SectionTitle>
                    <div className="responsive-grid-medium">
                        <TechCard
                            icon={Cpu}
                            title="Runs on Your Machine"
                            description="Use Anthropic, OpenAI, or run completely local models. Private by default—your code and data stay yours unless you choose otherwise."
                        />
                        <TechCard
                            icon={Zap}
                            title="Any Vibe-coding IDE"
                            description="Seamlessly integrates into VSCode, Cursor, and JetBrains. Connects directly to the editor's workspace context and commands."
                        />
                        <TechCard
                            icon={Box}
                            title="Persistent Memory"
                            description="Remembers your project architecture, past decisions, and preferences. Becomes uniquely tailored to your codebase over time."
                        />
                        <TechCard
                            icon={Globe}
                            title="Browser & Web Control"
                            description="Can browse documentation, read API specs, and extract needed information from the web entirely autonomously."
                        />
                        <TechCard
                            icon={Terminal}
                            title="Full System Access"
                            description="Read and write files, run shell commands, execute tests, and build scripts. Full access or sandboxed—your choice."
                        />
                        <TechCard
                            icon={Shield}
                            title="Skills & Plugins"
                            description="Extend RecourseLLM with community skills or build your own. It can even dynamically write and compile its own skills."
                        />
                    </div>
                </div>
            </section>

            {/* Python Libraries Section */}
            <section className="section-spacing">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontWeight: 400, lineHeight: 1.1 }}>Massive Built-In Library</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>
                                Are you using MCP for something Python already has built-in? Why? You're wasting tokens. Here are all the tools RecourseLLM has built-in:
                            </p>
                        </div>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
                            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search libraries or descriptions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 44px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '12px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    backdropFilter: 'blur(12px)',
                                    transition: 'border-color 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'rgba(214,160,75,0.5)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        padding: '4px'
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="responsive-grid-large" style={{ gap: '30px' }}>
                        {filteredCategories.map(({ categoryName, libraries }) => (
                            <CategoryBlock key={categoryName} categoryName={categoryName} libraries={libraries} />
                        ))}
                    </div>

                    {filteredCategories.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
                            <Search size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No libraries found</h3>
                            <p>We couldn't naturally find a library matching "{searchQuery}".<br />But remember, RecourseLLM can pip install anything on the fly!</p>
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
};

export default Installation;
