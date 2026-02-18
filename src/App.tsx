import { motion } from 'framer-motion';
import { Cpu, ChevronRight, Github, Twitter, Layers } from 'lucide-react';
import './index.css';

const Nav = () => (
  <nav style={{
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 100,
    height: '72px',
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  }}>
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
        <Layers size={24} color="var(--accent-primary)" />
        <span style={{ fontFamily: 'var(--font-sans)' }}>RecurveLLM</span>
      </div>
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
        <a href="#architecture" style={{ color: 'inherit', textDecoration: 'none' }}>Architecture</a>
        <a href="#performance" style={{ color: 'inherit', textDecoration: 'none' }}>Performance</a>
        <a href="#docs" style={{ color: 'inherit', textDecoration: 'none' }}>Documentation</a>
        <button className="btn-premium">Sign In</button>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <header className="section-spacing" style={{ textAlign: 'center', paddingTop: '12rem' }}>
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--accent-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '24px',
          display: 'block'
        }}>
          Distributed AI Infrastructure
        </span>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', marginBottom: '32px' }}>
          Intelligence, <br />
          <span className="gradient-text">Massively Recursive.</span>
        </h1>
        <p style={{ maxWidth: '700px', margin: '0 auto 48px', fontSize: '1.25rem' }}>
          RecurveLLM is a context-agnostic model designer for high-performance deployments on resource-constrained hardware.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn-premium">Get Started <ChevronRight size={16} /></button>
          <button className="btn-premium" style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
            Read the Paper
          </button>
        </div>
      </motion.div>
    </div>
  </header>
);

const Architecture = () => (
  <section id="architecture" className="section-spacing">
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '24px' }}>REPL-Based Architecture</h2>
        <p style={{ maxWidth: '800px', margin: '0 auto' }}>
          By staging itself as a REPL, RecurveLLM uses the LLM as a tool to perform complex reasoning on data that would otherwise be too large to fit in the context window.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Cpu size={24} color="var(--accent-secondary)" /> Distributed Interface
          </h3>
          <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
            RecurveLLM orchestrates models through a proprietary distributed interface, managing instances with intelligent routing and behavior tree orchestration.
          </p>
          <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <li style={{ marginBottom: '8px' }}>• Behavior Tree Orchestration</li>
            <li style={{ marginBottom: '8px' }}>• Multi-instance performance by default</li>
            <li style={{ marginBottom: '8px' }}>• Programmatic sandbox environment</li>
          </ul>
        </div>
        <div className="glass-card" style={{ background: '#0a0a0a', fontFamily: 'monospace', padding: '1.5rem', border: '1px solid #333' }}>
          <div style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></div>
          </div>
          <div style={{ color: '#27c93f' }}>$ recurve-llm run --distributed</div>
          <div style={{ color: '#aaa' }}>[INFO] Initializing Protocol Interface Layer...</div>
          <div style={{ color: '#aaa' }}>[INFO] Spawning Root Instance (Port 9000)...</div>
          <div style={{ color: '#aaa' }}>[INFO] Spawning Recursive Instances (Port 9001)...</div>
          <div style={{ color: '#d6a04b', marginTop: '1rem' }}>Processing 1.2M tokens...</div>
          <div style={{ color: '#27c93f' }}>✓ Task completed in 4.2s (80% token reduction)</div>
        </div>
      </div>
    </div>
  </section>
);

const Stats = () => (
  <section id="performance" className="section-spacing" style={{ background: 'linear-gradient(to bottom, transparent, #050505)' }}>
    <div className="container">
      <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Efficiency Unlocked</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>80%</div>
            <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Token Load Reduction</p>
          </div>
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>10GB</div>
            <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Minimum VRAM Requirements</p>
          </div>
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>15yr</div>
            <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hardware Compatibility</p>
          </div>
        </div>
        <p style={{ marginTop: '3rem', maxWidth: '600px', margin: '3rem auto 0' }}>
          This system runs long context jobs on deprecated 1060 series mining GPUs and DDR3 RAM from 15 years ago.
        </p>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border-subtle)' }}>
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 600 }}>
          <Layers size={20} color="var(--accent-primary)" />
          <span>RecurveLLM</span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Github size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
          <Twitter size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
        </div>
      </div>
      <div style={{ marginTop: '2rem', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
        © {new Date().getFullYear()} RecurveLLM. All rights reserved. Built for the distributed future.
      </div>
    </div>
  </footer>
);

const App = () => {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'fixed',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(214,160,75,0.08) 0%, rgba(0,0,0,0) 70%)',
        zIndex: -1
      }} />
      <Nav />
      <main>
        <Hero />
        <Architecture />
        <Stats />
      </main>
      <Footer />
    </div>
  );
};

export default App;
