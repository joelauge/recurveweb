import { Building2, Copy, Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const FundTransfer = ({ onComplete }: { onComplete: () => void }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const bankDetails = {
    bankName: "Silicon Valley Bank",
    routingNumber: "121042882",
    accountNumber: "3300998811",
    accountName: "Recourse Software Inc.",
    reference: "SAFE Setup - [Your Name]"
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFinish = () => {
    // Simulated Email logic
    console.log("SENDING EMAIL: Investor has marked funds as transferred.");
    
    onComplete();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
        <Building2 color="var(--accent-primary)" size={28} />
        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Transfer Funds</h2>
      </div>

      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem', margin: 0 }}>
          Please initiate a wire transfer or ACH payment using the details below. Ensure you include your name in the reference field so we can match the incoming funds to your signed SAFE agreement.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem', 
          background: 'rgba(0,0,0,0.3)', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          fontFamily: 'monospace', 
          fontSize: '0.9rem' 
        }}>
          {Object.entries(bankDetails).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '12px 16px', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border-subtle)',
                  transition: 'border-color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(214,160,75,0.5)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <span style={{ color: 'var(--text-primary)', userSelect: 'all' }}>{value}</span>
                <button 
                  onClick={() => copyToClipboard(value, key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: copiedField === key ? '#4ade80' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Copy to clipboard"
                  onMouseOver={e => { if(copiedField !== key) e.currentTarget.style.color = 'var(--accent-primary)'; }}
                  onMouseOut={e => { if(copiedField !== key) e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                >
                  {copiedField === key ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{
          background: 'rgba(234, 179, 8, 0.1)',
          border: '1px solid rgba(234, 179, 8, 0.2)',
          padding: '1rem',
          borderRadius: '8px',
          display: 'flex',
          gap: '12px',
          fontSize: '0.875rem',
          color: 'rgba(253, 224, 71, 0.9)'
        }}>
          <div style={{ flexShrink: 0, marginTop: '2px' }}>⚠️</div>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            Funds must be received within 5 business days of signing to guarantee your allocation at the current terms.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <button 
          onClick={handleFinish}
          className="btn-premium"
          style={{ padding: '12px 24px', fontSize: '1rem' }}
        >
          <span>I have initiated the transfer</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default FundTransfer;
