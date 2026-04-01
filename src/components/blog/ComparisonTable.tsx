import React from 'react';

interface ComparisonRow {
  feature: string;
  severity: string;
  severityType: 'bad' | 'mid' | 'good';
  mechanism: string;
  escape: string;
  escapeType: 'bad' | 'mid' | 'good';
}

interface ComparisonTableProps {
  label: string;
  rows: ComparisonRow[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ label, rows }) => {
  const getColor = (type: string) => {
    switch (type) {
      case 'bad': return '#ef4444';
      case 'mid': return '#f59e0b';
      case 'good': return '#22c55e';
      default: return 'inherit';
    }
  };

  return (
    <div className="glass-card" style={{ padding: 0, margin: '4rem 0', overflow: 'hidden' }}>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        color: 'var(--accent-primary)',
        textTransform: 'uppercase',
        padding: '1.25rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        opacity: 0.8,
        margin: 0
      }}>
        {label}
      </p>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderRight: '1px solid rgba(255,255,255,0.05)' }}>Protocol / Framework</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderRight: '1px solid rgba(255,255,255,0.05)' }}>Bloat severity</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', borderRight: '1px solid rgba(255,255,255,0.05)' }}>Mechanism</th>
              <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Implementation escape?</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: idx === rows.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-primary)', borderRight: '1px solid rgba(255,255,255,0.05)', fontWeight: 500 }}>{row.feature}</td>
                <td style={{ padding: '1.25rem 1.5rem', color: getColor(row.severityType), borderRight: '1px solid rgba(255,255,255,0.05)' }}>{row.severity}</td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', borderRight: '1px solid rgba(255,255,255,0.05)', lineHeight: 1.6 }}>{row.mechanism}</td>
                <td style={{ padding: '1.25rem 1.5rem', color: getColor(row.escapeType) }}>{row.escape}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
