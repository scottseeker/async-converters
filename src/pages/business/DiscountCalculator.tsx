import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './business.module.css';

export default function DiscountCalculator() {
  const [original, setOriginal] = useState('');
  const [pct, setPct] = useState('');

  const o = parseFloat(original);
  const d = parseFloat(pct);
  const saving = !isNaN(o) && !isNaN(d) ? (o * d) / 100 : null;
  const final = saving !== null ? o - saving : null;

  return (
    <ConverterShell title="Discount Calculator" description="Calculate the final price after applying a percentage discount." category="finance">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="dc-orig">Original Price ($)</label>
            <input id="dc-orig" type="number" min="0" step="0.01" placeholder="99.99" value={original} onChange={e => setOriginal(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="dc-pct">Discount (%)</label>
            <input id="dc-pct" type="number" min="0" max="100" step="0.1" placeholder="20" value={pct} onChange={e => setPct(e.target.value)} />
          </div>
        </div>
        {saving !== null && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>${saving.toFixed(2)}</div><div className={styles.statLabel}>You save</div></div>
            <div className={styles.stat}><div className={styles.statNum}>${final!.toFixed(2)}</div><div className={styles.statLabel}>Final price</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
