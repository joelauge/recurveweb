import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

const BlogSubscribe = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');

    try {
      const response = await fetch('https://recourse-api.joelauge.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          formMode: 'blog_subscribe',
        }),
      });

      if (!response.ok) throw new Error();

      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error('Subscription error:', err);
      // Fallback for simulation if needed, but we aim for real integration
      setStatus('error');
    }
  };

  return (
    <section style={{ padding: '6rem 0', position: 'relative' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card"
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'radial-gradient(circle at top right, rgba(214,160,75,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle2 size={48} color="#D6A04B" style={{ marginBottom: '1.5rem', marginInline: 'auto' }} />
              <h2 style={{ marginBottom: '1rem' }}>You're Subscribed!</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                Thanks for joining the RecourseLLM engineering blog. We'll send the latest architecture deep-dives straight to your inbox.
              </p>
              <button 
                onClick={() => setStatus('idle')}
                className="btn-premium" 
                style={{ marginTop: '2rem' }}
              >
                Back
              </button>
            </motion.div>
          ) : (
            <>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Stay in the Loop</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem auto', fontSize: '1.1rem' }}>
                Subscribe to receive engineering deep-dives, architectural updates, and news from the RecourseLLM team. No spam, just intelligence.
              </p>

              <form 
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  gap: '12px',
                  maxWidth: '500px',
                  margin: '0 auto',
                  flexDirection: window.innerWidth < 640 ? 'column' : 'row'
                }}
              >
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'submitting'}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-premium"
                  style={{
                    padding: '14px 28px',
                    height: '100%',
                    justifyContent: 'center'
                  }}
                >
                  {status === 'submitting' ? 'Joining...' : (
                    <>Subscribe <Send size={18} /></>
                  )}
                </button>
              </form>
              
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ color: '#ff5f56', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
                >
                  <AlertCircle size={16} /> Something went wrong. Please try again.
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSubscribe;
