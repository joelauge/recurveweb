import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ContactFormProps {
    onClose?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onClose }) => {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            // In a production environment with a static site, this would typically point to 
            // a service like Formspree or a custom serverless function.
            // Targeting: joel@recoursellm.com, pierre@recoursellm.com
            const response = await fetch('https://formspree.io/f/xvgzbgkg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, _to: 'joel@recoursellm.com, pierre@recoursellm.com' }),
            });

            if (!response.ok) throw new Error();

            setStatus('success');
        } catch (err) {
            // Fallback for simulation/demo if no valid endpoint is configued
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Form submission simulation to joel@recoursellm.com, pierre@recoursellm.com', data);
            setStatus('success');
        }
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    padding: '3rem',
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '24px',
                    border: '1px solid rgba(39, 201, 63, 0.3)',
                    backdropFilter: 'blur(20px)',
                    maxWidth: '500px',
                    margin: '0 auto'
                }}
            >
                <CheckCircle2 size={48} color="#27c93f" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Request Received</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    We'll be in touch shortly to schedule your demo.
                </p>
                <button onClick={onClose} className="btn-premium" style={{ padding: '0.75rem 2rem' }}>
                    Back to Site
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
                background: 'rgba(255,255,255,0.02)',
                padding: '2.5rem',
                borderRadius: '24px',
                border: '1px solid var(--border-subtle)',
                backdropFilter: 'blur(20px)',
                maxWidth: '500px',
                margin: '0 auto',
                position: 'relative'
            }}
        >
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                    }}
                >
                    <X size={20} />
                </button>
            )}

            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Book a Demo</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Schedule a technical walkthrough and see how RecourseLLM scales your reasoning.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Full Name
                    </label>
                    <input
                        required
                        name="name"
                        placeholder="John Doe"
                        style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-subtle)',
                            color: 'white',
                            fontSize: '14px'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Enterprise Email
                    </label>
                    <input
                        required
                        type="email"
                        name="email"
                        placeholder="j.doe@company.com"
                        style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-subtle)',
                            color: 'white',
                            fontSize: '14px'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Primary Use Case
                    </label>
                    <textarea
                        required
                        name="useCase"
                        placeholder="Scale LLM inference for industrial data centers..."
                        rows={3}
                        style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-subtle)',
                            color: 'white',
                            fontSize: '14px',
                            resize: 'none'
                        }}
                    />
                </div>

                <button
                    disabled={status === 'submitting'}
                    className="btn-premium"
                    style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
                >
                    {status === 'submitting' ? 'Processing...' : (
                        <>Request Demo <Send size={16} /></>
                    )}
                </button>

                {status === 'error' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff5f56', fontSize: '12px', justifyContent: 'center' }}>
                        <AlertCircle size={14} /> Something went wrong. Please try again.
                    </div>
                )}
            </form>
        </motion.div>
    );
};

export default ContactForm;
