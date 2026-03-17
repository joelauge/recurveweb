import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Download, FileSignature, CheckCircle, RefreshCcw, DollarSign, User, Clock } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const SafeAgreement = ({ onComplete }: { onComplete: () => void }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [amount, setAmount] = useState<string>('50000');
  const [amountError, setAmountError] = useState<string>('');
  const [investorName, setInvestorName] = useState<string>('');
  const [contractDate, setContractDate] = useState<string>('');

  const clearSignature = () => {
    sigCanvas.current?.clear();
    setIsSigned(false);
  };

  const validateAmount = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 50000) {
      setAmountError('Minimum investment is $50,000');
      return false;
    }
    setAmountError('');
    return true;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAmount(val);
    validateAmount(val);
  };

  const handleTimestamp = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setContractDate(formatted);
  };

  const generatePDF = async () => {
    if (!documentRef.current || !validateAmount(amount)) return;
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(documentRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('RecourseSoftware_SAFE_Agreement.pdf');
    } catch (error) {
      console.error("Error generating PDF", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const completeStep = async () => {
    if (!validateAmount(amount)) {
      alert("Minimum investment is $50,000");
      return;
    }
    if (!investorName.trim()) {
      alert("Please enter your legal name.");
      return;
    }
    if (!contractDate) {
      alert("Please timestamp the document before proceeding.");
      return;
    }
    if (!isSigned) {
      alert("Please sign the document before proceeding.");
      return;
    }
    // Also generate PDF on complete automatically for the user
    await generatePDF();
    
    // Send email notification (placeholder)
    console.log(`SENDING EMAIL: User (${investorName}) has signed the SAFE for $${amount}.`);
    
    onComplete();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileSignature color="var(--accent-primary)" size={32} />
          <h2 style={{ fontSize: '2rem', margin: 0, fontFamily: 'var(--font-serif)' }}>Review & Sign</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {/* Investor Name Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Investor Legal Name</label>
            <div style={{ position: 'relative' }}>
              <User size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
              <input 
                type="text" 
                placeholder="Full Legal Name"
                value={investorName}
                onChange={(e) => setInvestorName(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 12px 10px 36px',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  width: '240px',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
              />
            </div>
          </div>

          {/* Amount Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Investment Amount ($)</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
              <input 
                type="number" 
                min="50000"
                value={amount}
                onChange={handleAmountChange}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: amountError ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 12px 10px 36px',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  width: '180px',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = amountError ? '#ef4444' : 'var(--border-subtle)'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Document View */}
      <div 
        ref={documentRef}
        style={{
          background: '#ffffff',
          color: '#000000',
          padding: '3.5rem',
          borderRadius: '16px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
          maxHeight: '65vh',
          overflowY: 'auto',
          fontFamily: 'var(--font-serif)',
          position: 'relative'
        }}
        className="custom-scrollbar"
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', color: '#000', letterSpacing: '0.02em' }}>Simple Agreement for Future Equity</h1>
          <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto' }}>
            THIS CERTIFIES THAT in exchange for the payment by the undersigned investor (the "Investor") of <strong style={{ color: '#000' }}>${Number(amount).toLocaleString()}</strong> (the "Purchase Amount") on or about <strong style={{ color: '#000' }}>{contractDate || '[DATE]'}</strong>, Recourse Software Inc., an Ontario corporation (the "Company"), hereby issues to the Investor the right to certain shares of the Company's Capital Stock, subject to the terms set forth below.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', fontSize: '1rem', lineHeight: 1.7, color: '#111827' }}>
          <section>
            <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.75rem', color: '#000' }}>1. Events</h3>
            <p style={{ marginBottom: '0.75rem' }}><strong>(a) Equity Financing.</strong> If there is an Equity Financing before the expiration or termination of this instrument, the Company will automatically issue to the Investor either: (1) a number of shares of Standard Preferred Stock equal to the Purchase Amount divided by the price per share of the Standard Preferred Stock, if the post-money valuation is less than or equal to the Valuation Cap; or (2) a number of shares of Safe Preferred Stock equal to the Purchase Amount divided by the Safe Price, if the post-money valuation is greater than the Valuation Cap.</p>
            <p><strong>(b) Liquidity Event.</strong> If there is a Liquidity Event before the expiration or termination of this instrument, the Investor will, at its option, either (i) receive a cash payment equal to the Purchase Amount (subject to the following paragraph) or (ii) automatically receive from the Company a number of shares of Common Stock equal to the Purchase Amount divided by the Liquidity Price, if the Investor fails to select the cash option.</p>
          </section>

          <section>
            <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.75rem', color: '#000' }}>2. Definitions</h3>
            <p style={{ marginBottom: '0.5rem' }}>"Valuation Cap" means $15,000,000 (Post-Money).</p>
            <p>"Discount Rate" means 80% (yielding a 20% Discount).</p>
          </section>

          <div style={{ marginTop: '5rem', paddingTop: '2.5rem', borderTop: '2px solid #e5e7eb' }}>
            <div style={{ marginBottom: '3rem', fontSize: '1.05rem', fontStyle: 'italic' }}>
              <strong>IN WITNESS WHEREOF</strong>, the parties have executed this agreement as of the date signed below.
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'space-between' }}>
              <div style={{ flex: '1 1 300px' }}>
                <p style={{ fontWeight: 800, marginBottom: '1.5rem', color: '#000', fontSize: '1.1rem' }}>COMPANY: Recourse Software Inc.</p>
                <div style={{ height: '80px', borderBottom: '2px solid #000', marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', color: '#000' }}>Joel Auge</span>
                </div>
                <p style={{ color: '#4b5563', fontWeight: 500 }}>Name: Joel Auge</p>
                <p style={{ color: '#4b5563', fontWeight: 500 }}>Title: CEO</p>
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <p style={{ fontWeight: 800, marginBottom: '1.5rem', color: '#000', fontSize: '1.1rem' }}>INVESTOR: {investorName || '_______________________'}</p>
                <div style={{ 
                  height: '120px', 
                  border: '2px dashed #d1d5db', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '12px', 
                  position: 'relative', 
                  overflow: 'hidden', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {!isSigned && (
                    <span style={{ 
                      color: '#9ca3af', 
                      fontSize: '0.9rem', 
                      position: 'absolute', 
                      pointerEvents: 'none',
                      fontFamily: 'var(--font-sans)',
                      fontStyle: 'italic'
                    }}>Sign legally here</span>
                  )}
                  <SignatureCanvas 
                    ref={sigCanvas}
                    canvasProps={{ style: { width: '100%', height: '100%', cursor: 'crosshair' } }}
                    onEnd={() => setIsSigned(true)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                  <button 
                    onClick={clearSignature} 
                    style={{ 
                      fontSize: '0.8rem', 
                      color: '#3b82f6', 
                      background: 'none',
                      border: 'none',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    <RefreshCcw size={14} /> Clear Signature
                  </button>
                </div>
                <p style={{ marginTop: '1.5rem', fontWeight: 500, color: '#4b5563' }}>Date: {contractDate || '________________'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'rgba(255,255,255,0.05)', 
        padding: '2rem', 
        borderRadius: '16px', 
        border: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleTimestamp}
              style={{
                background: contractDate ? 'rgba(74, 222, 128, 0.1)' : 'rgba(214,160,75,0.1)',
                border: contractDate ? '1px solid #4ade80' : '1px solid var(--accent-primary)',
                color: contractDate ? '#4ade80' : 'var(--accent-primary)',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <Clock size={16} />
              {contractDate ? 'Contract Timestamped' : 'Timestamp Document'}
            </button>
            {contractDate && <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{contractDate}</span>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isSigned ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80' }}>
                <CheckCircle size={20} />
                <span style={{ fontWeight: 600 }}>Signature Secured</span>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Please provide legal name, timestamp and signature.</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={generatePDF}
            disabled={!isSigned || isGenerating || !!amountError || !investorName.trim() || !contractDate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '8px',
              fontWeight: 600,
              background: 'rgba(255,255,255,0.1)',
              color: 'var(--text-primary)',
              border: '1px solid transparent',
              cursor: (!isSigned || isGenerating || !!amountError || !investorName.trim() || !contractDate) ? 'not-allowed' : 'pointer',
              opacity: (!isSigned || isGenerating || !!amountError || !investorName.trim() || !contractDate) ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { if(!(!isSigned || isGenerating || !!amountError || !investorName.trim() || !contractDate)) e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
            onMouseOut={e => { if(!(!isSigned || isGenerating || !!amountError || !investorName.trim() || !contractDate)) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          >
            <Download size={20} />
            {isGenerating ? "Processing..." : "Download PDF"}
          </button>
          
          <button 
            onClick={completeStep}
            disabled={!isSigned || !!amountError || !investorName.trim() || !contractDate}
            className="btn-premium"
            style={{
              opacity: (!isSigned || !!amountError || !investorName.trim() || !contractDate) ? 0.5 : 1,
              cursor: (!isSigned || !!amountError || !investorName.trim() || !contractDate) ? 'not-allowed' : 'pointer',
              padding: '14px 32px'
            }}
          >
            Finalize & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafeAgreement;
