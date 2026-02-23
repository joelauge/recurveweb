import { Github, Twitter, Youtube } from 'lucide-react';

const Footer = () => (
    <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/recourse_logo_white.png" alt="RecourseLLM Logo" style={{ height: '40px', width: 'auto' }} />
                </div>
                <div style={{ display: 'flex', gap: '24px' }}>
                    <a href="https://github.com/recoursellm" target="_blank" rel="noopener noreferrer" style={{ display: 'flex' }}>
                        <Github size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
                    </a>
                    <a href="https://x.com/recoursellm" target="_blank" rel="noopener noreferrer" style={{ display: 'flex' }}>
                        <Twitter size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
                    </a>
                    <a href="https://youtube.com/@RecourseLLM" target="_blank" rel="noopener noreferrer" style={{ display: 'flex' }}>
                        <Youtube size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
                    </a>
                </div>
            </div>
            <div style={{ marginTop: '2rem', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                © {new Date().getFullYear()} RecourseLLM. All rights reserved. Architected for the distributed future.
            </div>
        </div>
    </footer>
);

export default Footer;
