import React from 'react';

interface Principle {
  num: string;
  title: string;
  text: string;
}

interface PrincipleGridProps {
  principles: Principle[];
}

const PrincipleGrid: React.FC<PrincipleGridProps> = ({ principles }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      margin: '4rem 0',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {principles.map((principle, index) => (
        <div key={index} style={{
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '2.5rem',
          transition: 'background 0.3s ease'
        }}>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            color: 'var(--accent-primary)',
            display: 'block',
            marginBottom: '1rem',
            opacity: 0.7
          }}>
            {principle.num}
          </span>
          <h4 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.25rem',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            {principle.title}
          </h4>
          <p style={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            {principle.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PrincipleGrid;
