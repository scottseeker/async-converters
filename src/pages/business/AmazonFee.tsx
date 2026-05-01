import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './business.module.css';

// Amazon FBA simplified rates
const CATEGORIES = [
  { label: 'Most categories', pct: 15 },
  { label: 'Books', pct: 15 },
  { label: 'Consumer Electronics', pct: 8 },
  { label: 'Clothing & Accessories', pct: 17 },
  { label: 'Grocery', pct: 8 },
  { label: 'Jewelry', pct: 20 },
];

export default function AmazonFee() {
  const [price, setPrice] = useState('');
  const [fbaWeight, setFbaWeight] = useState('');
  const [catIdx, setCatIdx] = useState(0);

  const p = parseFloat(price) || 0;
  const w = parseFloat(fbaWeight) || 0;
  const refPct = CATEGORIES[catIdx].pct / 100;
  const referral = p * refPct;
  // Simplified FBA fulfillment fee by weight
  const fba = w <= 1 ? 3.22 : w <= 2 ? 4.75 : w <= 5 ? 6.15 : 8.40;
  const total = referral + (w > 0 ? fba : 0);
  const net = p - total;

  const ready = p > 0;

  return (
    <ConverterShell title="Amazon FBA Fee Calculator" description="Estimate Amazon referral and FBA fulfillment fees for your products." category="finance">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="amz-price">Sale Price ($)</label>
            <input id="amz-price" type="number" min="0" step="0.01" placeholder="39.99" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="amz-wt">Weight (lbs, FBA)</label>
            <input id="amz-wt" type="number" min="0" step="0.01" placeholder="1.0" value={fbaWeight} onChange={e => setFbaWeight(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 2, minWidth: 180 }}>
            <label htmlFor="amz-cat">Category</label>
            <select id="amz-cat" value={catIdx} onChange={e => setCatIdx(Number(e.target.value))} style={{ width: '100%' }}>
              {CATEGORIES.map((c, i) => <option key={i} value={i}>{c.label} ({c.pct}%)</option>)}
            </select>
          </div>
        </div>
        {ready && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>${referral.toFixed(2)}</div><div className={styles.statLabel}>Referral fee</div></div>
            {w > 0 && <div className={styles.stat}><div className={styles.statNum}>${fba.toFixed(2)}</div><div className={styles.statLabel}>FBA fee</div></div>}
            <div className={styles.stat}><div className={styles.statNum}>${total.toFixed(2)}</div><div className={styles.statLabel}>Total fees</div></div>
            <div className={styles.stat}><div className={styles.statNum} style={{ color: net > 0 ? 'var(--accent)' : '#e55' }}>${net.toFixed(2)}</div><div className={styles.statLabel}>Net payout</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
