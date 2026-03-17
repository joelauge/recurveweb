import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, FileText, CheckCircle, Upload, Library } from 'lucide-react';
import SafeAgreement from '../components/SafeAgreement';
import FundTransfer from '../components/FundTransfer';
import Materials from '../components/Materials';

const Invest = () => {
  const [step, setStep] = useState(0); // 0: Verification, 1: Welcome, 2: Materials, 3: SAFE, 4: Fund Transfer, 5: Completed
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Placeholder list of allowed emails
  const allowedEmails = ['investor@example.com', 'test@test.com', 'joelauge@gmail.com'];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (allowedEmails.includes(email.toLowerCase().trim())) {
      setErrorMsg('');
      setStep(1);
    } else {
      setErrorMsg("You'll be notified by email if/when you're approved to access the dataroom.");
    }
  };

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '8rem', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '100px',
            background: 'rgba(214,160,75,0.1)',
            color: 'var(--accent-primary)',
            fontSize: '0.9rem',
            fontWeight: 500,
            border: '1px solid rgba(214,160,75,0.2)',
            marginBottom: '1.5rem'
          }}>
            <Lock size={16} />
            <span>Secure Investor Portal</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>
            <span className="gradient-text">Invest in RecourseLLM</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Review materials, sign the SAFE agreement, and complete your investment process seamlessly in our automated dataroom.
          </p>
        </motion.div>

        {/* Progress Tracker */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '700px',
          margin: '0 auto 4rem auto',
          position: 'relative',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '3rem'
        }}>
          <div style={{
            position: 'absolute',
            top: 'calc(3rem + 20px)',
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'var(--border-subtle)',
            zIndex: -1
          }} />
          {[
            { icon: Lock, label: 'Portal' },
            { icon: Library, label: 'Materials' },
            { icon: FileText, label: 'Sign SAFE' },
            { icon: ArrowRight, label: 'Funds' }
          ].map((item, i) => {
            const displayStep = i + 1;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: step >= displayStep ? '2px solid var(--accent-primary)' : '2px solid rgba(255,255,255,0.2)',
                  background: step > displayStep ? 'var(--accent-primary)' : (step === displayStep ? 'var(--bg-color)' : 'rgba(255,255,255,0.05)'),
                  color: step > displayStep ? 'var(--bg-color)' : (step === displayStep ? 'var(--accent-primary)' : 'rgba(255,255,255,0.4)'),
                  transition: 'all 0.3s ease',
                  zIndex: 1
                }}>
                  {step > displayStep ? <CheckCircle size={20} /> : <item.icon size={20} />}
                </div>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: step >= displayStep ? 'var(--text-primary)' : 'rgba(255,255,255,0.4)',
                  textAlign: 'center'
                }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
          style={{ padding: '3rem', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          {step === 0 && (
            <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(214,160,75,0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem auto'
              }}>
                <Lock size={32} color="var(--accent-primary)" />
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Verify Access</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                Please enter your email address to access the dataroom.
              </p>
              
              <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    outline: 'none',
                    width: '100%'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                />
                
                {errorMsg && (
                  <div style={{
                    color: '#ef4444',
                    fontSize: '0.9rem',
                    padding: '12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    lineHeight: '1.4'
                  }}>
                    {errorMsg}
                  </div>
                )}
                
                <button 
                  type="submit"
                  className="btn-premium"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                >
                  Verify Email
                </button>
              </form>
            </div>
          )}

          {step === 1 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(214,160,75,0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem auto'
              }}>
                <Upload size={32} color="var(--accent-primary)" />
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Welcome to the Dataroom</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
                You have been invited to participate in the RecourseLLM fundraising round. Please proceed to review the materials and sign the SAFE agreement.
              </p>
              <button 
                className="btn-premium"
                onClick={() => setStep(2)}
              >
                Proceed to Materials
              </button>
            </div>
          )}

          {step === 2 && (
            <Materials onComplete={() => setStep(3)} />
          )}

          {step === 3 && (
            <SafeAgreement onComplete={() => setStep(4)} />
          )}

          {step === 4 && (
            <FundTransfer onComplete={() => setStep(5)} />
          )}

          {step === 5 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(74, 222, 128, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem auto'
              }}>
                <CheckCircle size={40} color="#4ade80" />
              </div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Thank You!</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
                Your investment documents have been processed and an email confirmation has been sent to you and the RecourseLLM team. Welcome aboard!
              </p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default Invest;
