import React from 'react';

interface RagSession {
  name: string;
  tokens: string;
  newWidth: string;
  rereadWidth: string;
  rereadLeft?: string;
  label: string;
}

interface RagDiagramProps {
  label: string;
  sessions: RagSession[];
}

const RagDiagram: React.FC<RagDiagramProps> = ({ label, sessions }) => {
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

      {sessions.map((session, idx) => (
        <div key={idx} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {session.name}
            </span>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
              {session.tokens}
            </span>
          </div>
          <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ height: '100%', position: 'absolute', left: 0, top: 0, background: '#3b82f6', opacity: 0.7, width: session.newWidth }} />
            <div style={{ height: '100%', position: 'absolute', top: 0, background: '#ef4444', opacity: 0.6, width: session.rereadWidth, left: session.rereadLeft || 0 }} />
          </div>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic', opacity: 0.7 }}>
            {session.label}
          </p>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '12px', height: '12px', background: '#3b82f6', opacity: 0.7 }} />
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>New retrieval</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '12px', height: '12px', background: '#ef4444', opacity: 0.6 }} />
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Re-read / repeated injection</span>
        </div>
      </div>
    </div>
  );
};

export default RagDiagram;
