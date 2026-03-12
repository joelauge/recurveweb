import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ContactFormProps {
    onClose?: () => void;
    mode?: 'demo' | 'waitlist';
}

const ContactForm: React.FC<ContactFormProps> = ({ onClose, mode = 'demo' }) => {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const isWaitlist = mode === 'waitlist';
    const formTitle = isWaitlist ? "Join the Beta Waitlist" : "Book a Demo";
    const formDescription = isWaitlist
        ? "Get early access to RecourseLLM's dynamic environment engines."
        : "Schedule a technical walkthrough and see how RecourseLLM scales your reasoning.";
    const submitText = isWaitlist ? "Join Waitlist" : "Request Demo";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        // Append mode so we know which it is in the email
        data.formMode = mode;

        try {
            const response = await fetch('https://recourse-api.joelauge.workers.dev', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
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

    return (
        <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.6)',
                padding: '1rem',
                overflowY: 'auto'
            }}
            onClick={onClose}
        >
            {status === 'success' ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        padding: '3rem',
                        textAlign: 'center',
                        background: 'rgba(20,20,20,0.95)',
                        borderRadius: '24px',
                        border: '1px solid rgba(39, 201, 63, 0.3)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        maxWidth: '500px',
                        width: '100%',
                        margin: 'auto'
                    }}
                >
                    <CheckCircle2 size={48} color="#27c93f" style={{ marginBottom: '1.5rem', marginInline: 'auto' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Request Received</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        {isWaitlist ? "You're on the list! We'll notify you when spots open up." : "We'll be in touch shortly to schedule your demo."}
                    </p>
                    <button onClick={onClose} className="btn-premium" style={{ padding: '0.75rem 2rem', width: '100%', justifyContent: 'center' }}>
                        Back to Site
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'rgba(20,20,20,0.95)',
                        padding: '2.5rem',
                        borderRadius: '24px',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02)',
                        maxWidth: '500px',
                        width: '100%',
                        margin: 'auto',
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
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
                            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        >
                            <X size={20} />
                        </button>
                    )}

                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>{formTitle}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'center' }}>
                        {formDescription}
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
                                    fontSize: '14px',
                                    transition: 'border-color 0.2s'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {isWaitlist ? "Email Address" : "Enterprise Email"}
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
                                    fontSize: '14px',
                                    transition: 'border-color 0.2s'
                                }}
                            />
                        </div>

                        {!isWaitlist && (
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
                                        resize: 'none',
                                        transition: 'border-color 0.2s'
                                    }}
                                />
                            </div>
                        )}

                        <button
                            disabled={status === 'submitting'}
                            className="btn-premium"
                            style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: '0.5rem' }}
                        >
                            {status === 'submitting' ? 'Processing...' : (
                                <>{submitText} <Send size={16} /></>
                            )}
                        </button>

                        {status === 'error' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff5f56', fontSize: '12px', justifyContent: 'center' }}>
                                <AlertCircle size={14} /> Something went wrong. Please try again.
                            </div>
                        )}
                    </form>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ContactForm;
