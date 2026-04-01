import React from 'react';

interface McpCall {
  label: string;
  tokens: string;
  blocks: { type: 'system' | 'tool' | 'result' | 'new'; label: string }[];
}

interface McpDiagramProps {
  label: string;
  calls: McpCall[];
}

const McpDiagram: React.FC<McpDiagramProps> = ({ label, calls }) => {
  const getBlockStyle = (type: string) => {
    switch (type) {
      case 'system': return { background: '#1e2a1e', border: '1px solid #2d4a2d', color: '#4a8a4a', width: '64px' };
      case 'tool': return { background: '#2a1e1e', border: '1px solid #4a2d2d', color: '#8a4a4a', width: '52px' };
      case 'result': return { background: '#2a221e', border: '1px solid #4a3a2d', color: '#8a6a4a', width: '52px' };
      case 'new': return { background: '#1e222a', border: '1px solid #2d3a4a', color: '#4a6a8a', width: '72px' };
      default: return {};
    }
  };

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {calls.map((call, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--text-secondary)', width: '6rem', flexShrink: 0 }}>
              {call.label}
            </span>
            <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', flex: 1 }}>
              {call.blocks.map((block, bIdx) => (
                <div key={bIdx} style={{ 
                  height: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontFamily: 'var(--font-mono, monospace)', 
                  fontSize: '0.6rem', 
                  letterSpacing: '0.04em',
                  borderRadius: '1px',
                  ...getBlockStyle(block.type)
                }}>
                  {block.label}
                </div>
              ))}
            </div>
            <span style={{ 
              fontFamily: 'var(--font-mono, monospace)', 
              fontSize: '0.75rem', 
              color: idx === 0 ? 'var(--text-secondary)' : '#ef4444', 
              width: '4rem', 
              textAlign: 'right',
              flexShrink: 0
            }}>
              {call.tokens}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '12px', height: '12px', background: '#1e2a1e', border: '1px solid #2d4a2d' }} />
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>System prompt</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '12px', height: '12px', background: '#2a1e1e', border: '1px solid #4a2d2d' }} />
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>tool_use block</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '12px', height: '12px', background: '#2a221e', border: '1px solid #4a3a2d' }} />
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>tool_result block</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '12px', height: '12px', background: '#1e222a', border: '1px solid #2d3a4a' }} />
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Current query</span>
        </div>
      </div>
    </div>
  );
};

export default McpDiagram;
