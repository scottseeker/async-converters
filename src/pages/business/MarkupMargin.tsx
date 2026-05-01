import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './business.module.css';

export default function MarkupMargin() {
  const [cost, setCost] = useState('');
  const [value, setValue] = useState('');
  const [mode, setMode] = useState<'markup' | 'margin'>('markup');

  const c = parseFloat(cost);
  const v = parseFloat(value) / 100;

  let price: number | null = null;
  let profit: number | null = null;
  let otherPct: number | null = null;

  if (!isNaN(c) && !isNaN(v) && v < 1 && v > 0) {
    if (mode === 'markup') {
      price = c * (1 + v);
      profit = price - c;
      otherPct = (profit / price) * 100;
    } else {
      price = c / (1 - v);
      profit = price - c;
      otherPct = (profit / c) * 100;
    }
  }

  return (
    <ConverterShell title="Markup vs Margin Calculator" description="Convert between markup percentage and margin percentage for any product cost." category="finance">
      <div className={styles.form}>
        <div className={styles.actions}>
          <button style={mode === 'markup' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode('markup')}>Start with Markup %</button>
          <button style={mode === 'margin' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode('margin')}>Start with Margin %</button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="mm-cost">Cost ($)</label>
            <input id="mm-cost" type="number" min="0" step="0.01" placeholder="10.00" value={cost} onChange={e => setCost(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="mm-val">{mode === 'markup' ? 'Markup (%)' : 'Margin (%)'}</label>
            <input id="mm-val" type="number" min="0" max={mode === 'margin' ? 99 : undefined} step="0.1" placeholder="50" value={value} onChange={e => setValue(e.target.value)} />
          </div>
        </div>
        {price !== null && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>${price.toFixed(2)}</div><div className={styles.statLabel}>Selling Price</div></div>
            <div className={styles.stat}><div className={styles.statNum}>${profit!.toFixed(2)}</div><div className={styles.statLabel}>Profit</div></div>
            <div className={styles.stat}><div className={styles.statNum}>{otherPct!.toFixed(2)}%</div><div className={styles.statLabel}>{mode === 'markup' ? 'Margin' : 'Markup'}</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
