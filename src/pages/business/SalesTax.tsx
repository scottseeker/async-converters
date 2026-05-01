import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './business.module.css';

export default function SalesTax() {
  const [price, setPrice] = useState('');
  const [rate, setRate] = useState('');
  const [mode, setMode] = useState<'add' | 'remove'>('add');

  const p = parseFloat(price);
  const r = parseFloat(rate) / 100;
  let tax: number | null = null;
  let total: number | null = null;

  if (!isNaN(p) && !isNaN(r)) {
    if (mode === 'add') {
      tax = p * r;
      total = p + tax;
    } else {
      total = p;
      tax = p - p / (1 + r);
    }
  }

  return (
    <ConverterShell title="Sales Tax Calculator" description="Add or remove sales tax from any price." category="finance">
      <div className={styles.form}>
        <div className={styles.actions}>
          <button style={mode === 'add' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode('add')}>Add tax</button>
          <button style={mode === 'remove' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode('remove')}>Remove tax (tax-inclusive)</button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="st-price">{mode === 'add' ? 'Pre-tax price ($)' : 'Tax-inclusive price ($)'}</label>
            <input id="st-price" type="number" min="0" step="0.01" placeholder="100.00" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="st-rate">Tax rate (%)</label>
            <input id="st-rate" type="number" min="0" step="0.01" placeholder="8.5" value={rate} onChange={e => setRate(e.target.value)} />
          </div>
        </div>
        {tax !== null && total !== null && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>${(mode === 'add' ? p : total - tax).toFixed(2)}</div><div className={styles.statLabel}>Pre-tax amount</div></div>
            <div className={styles.stat}><div className={styles.statNum}>${tax.toFixed(2)}</div><div className={styles.statLabel}>Tax amount</div></div>
            <div className={styles.stat}><div className={styles.statNum}>${total.toFixed(2)}</div><div className={styles.statLabel}>Total</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
