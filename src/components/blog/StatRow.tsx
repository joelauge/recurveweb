import React from 'react';

interface StatItem {
  num: string;
  label: string;
}

interface StatRowProps {
  stats: StatItem[];
}

const StatRow: React.FC<StatRowProps> = ({ stats }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1px',
      background: 'rgba(255, 255, 255, 0.1)',
      margin: '4rem 0',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {stats.map((stat, index) => (
        <div key={index} style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '3rem',
            fontWeight: 600,
            color: 'var(--accent-secondary)',
            display: 'block',
            lineHeight: 1,
            marginBottom: '1rem'
          }}>
            {stat.num}
          </span>
          <span style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatRow;
