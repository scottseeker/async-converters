import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './student.module.css';

function countSigFigs(n: string): number {
  const s = n.replace(/[^0-9.eE+-]/g, '').split(/[eE]/)[0];
  const clean = s.replace('-', '').replace('+', '');
  if (!clean || clean === '.') return 0;
  const withoutDecimal = clean.replace('.', '');
  // Remove leading zeros
  const significant = withoutDecimal.replace(/^0+/, '');
  if (clean.includes('.')) {
    return significant.length;
  } else {
    return significant.replace(/0+$/, '').length;
  }
}

function roundToSigFigs(n: number, sf: number): string {
  if (n === 0) return '0';
  const mag = Math.floor(Math.log10(Math.abs(n)));
  const factor = Math.pow(10, sf - mag - 1);
  const rounded = Math.round(n * factor) / factor;
  return rounded.toPrecision(sf);
}

export default function SigFigs() {
  const [input, setInput] = useState('');
  const [sfTarget, setSfTarget] = useState(3);
  const [mode, setMode] = useState<'count' | 'round'>('count');

  const num = parseFloat(input);
  const count = input.trim() ? countSigFigs(input.trim()) : null;
  const rounded = !isNaN(num) && mode === 'round' ? roundToSigFigs(num, sfTarget) : null;

  return (
    <ConverterShell title="Significant Figures" description="Count significant figures in a number or round to a given number of sig figs." category="student">
      <div className={styles.form}>
        <div className={styles.actions}>
          <button style={mode === 'count' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode('count')}>Count Sig Figs</button>
          <button style={mode === 'round' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode('round')}>Round to Sig Figs</button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 2, minWidth: 140 }}>
            <label htmlFor="sf-in">Number</label>
            <input id="sf-in" type="text" placeholder="0.004070" value={input} onChange={e => setInput(e.target.value)} />
          </div>
          {mode === 'round' && (
            <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
              <label htmlFor="sf-target">Sig figs: {sfTarget}</label>
              <input id="sf-target" type="range" min={1} max={10} value={sfTarget} onChange={e => setSfTarget(Number(e.target.value))} />
            </div>
          )}
        </div>
        {mode === 'count' && count !== null && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>{count}</div><div className={styles.statLabel}>Significant figures</div></div>
          </div>
        )}
        {mode === 'round' && rounded !== null && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>{rounded}</div><div className={styles.statLabel}>Rounded to {sfTarget} sig figs</div></div>
          </div>
        )}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          <strong>Rules:</strong> Non-zero digits are always sig. Zeros between sig digits are sig. Leading zeros are not sig. Trailing zeros with decimal are sig.
        </div>
      </div>
    </ConverterShell>
  );
}
