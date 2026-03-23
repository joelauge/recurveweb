import React from 'react';

interface TokenItem {
  name: string;
  val: string;
  waste: number;
  signal?: number;
  rllm?: number;
}

interface TokenDiagramProps {
  label: string;
  items: TokenItem[];
}

const TokenDiagram: React.FC<TokenDiagramProps> = ({ label, items }) => {
  return (
    <div className="glass-card" style={{ padding: '2.5rem', margin: '4rem 0' }}>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        color: 'var(--accent-primary)',
        textTransform: 'uppercase',
        marginBottom: '2rem',
        opacity: 0.8
      }}>
        {label}
      </p>

      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            fontSize: '0.9rem'
          }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.val}</span>
          </div>
          <div style={{
            height: '10px',
            background: 'rgba(255,255,255,0.05)',
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            display: 'flex'
          }}>
            {item.waste > 0 && (
              <div style={{
                height: '100%',
                width: `${item.waste}%`,
                background: '#ef4444',
                opacity: 0.6
              }} />
            )}
            {item.signal && (
              <div style={{
                height: '100%',
                width: `${item.signal}%`,
                background: '#22c55e',
                opacity: 0.8
              }} />
            )}
            {item.rllm && (
              <div style={{
                height: '100%',
                width: `${item.rllm}%`,
                background: 'var(--accent-primary)',
                boxShadow: '0 0 15px var(--accent-primary)'
              }} />
            )}
          </div>
        </div>
      ))}

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        marginTop: '2rem',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '10px', height: '10px', background: '#ef4444', opacity: 0.6, borderRadius: '2px' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Overhead / re-read</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '10px', height: '10px', background: '#22c55e', opacity: 0.8, borderRadius: '2px' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Reasoning / output</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '10px', height: '10px', background: 'var(--accent-primary)', borderRadius: '2px' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>RLLM active reasoning</span>
        </div>
      </div>
    </div>
  );
};

export default TokenDiagram;
