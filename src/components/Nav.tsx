import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
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
            <div className="nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 2rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-primary)', textDecoration: 'none' }}>
                    <img src="/recourse_logo_white.png" alt="RecourseLLM Logo" style={{ height: '48px', width: 'auto' }} />
                </Link>

                {/* Desktop Nav */}
                <div className="desktop-nav" style={{ display: 'flex', gap: '32px', alignItems: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <Link to="/installation" style={{ color: 'inherit', textDecoration: 'none' }}>Installation</Link>
                    <Link to="/architecture" style={{ color: 'inherit', textDecoration: 'none' }}>Architecture</Link>
                    <Link to="/#performance" style={{ color: 'inherit', textDecoration: 'none' }}>Performance</Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Navigation"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="mobile-nav-overlay"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            background: '#000000',
                            width: '100%',
                        }}
                    >
                        <Link
                            to="/installation"
                            style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'center',
                                padding: '1.5rem',
                                background: '#000000',
                                color: 'var(--text-primary)',
                                textDecoration: 'none',
                                fontSize: '1.5rem',
                                fontWeight: 500,
                                borderBottom: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            Installation
                        </Link>
                        <Link
                            to="/architecture"
                            style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'center',
                                padding: '1.5rem',
                                background: '#000000',
                                color: 'var(--text-primary)',
                                textDecoration: 'none',
                                fontSize: '1.5rem',
                                fontWeight: 500,
                                borderBottom: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            Architecture
                        </Link>
                        <Link
                            to="/#performance"
                            style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'center',
                                padding: '1.5rem',
                                background: '#000000',
                                color: 'var(--text-primary)',
                                textDecoration: 'none',
                                fontSize: '1.5rem',
                                fontWeight: 500,
                                borderBottom: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            Performance
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Nav;
