import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './business.module.css';

// eBay final value fees (simplified)
const CATEGORIES = [
  { label: 'Most categories', pct: 13.25, max: null },
  { label: 'Motors (Vehicles)', pct: 3.0, max: null },
  { label: 'Books/DVDs/Music', pct: 14.95, max: null },
  { label: 'Collectibles', pct: 13.25, max: 7500 },
];

export default function EbayFee() {
  const [price, setPrice] = useState('');
  const [shipping, setShipping] = useState('');
  const [catIdx, setCatIdx] = useState(0);

  const p = parseFloat(price) || 0;
  const s = parseFloat(shipping) || 0;
  const { pct, max } = CATEGORIES[catIdx];
  const base = p + s;
  let fvf = base * (pct / 100);
  if (max && fvf > max) fvf = max;
  const paymentFee = base * 0.03; // approximate payment processing
  const total = fvf + paymentFee;
  const net = p - total;

  const ready = p > 0;

  return (
    <ConverterShell title="eBay Fee Calculator" description="Estimate eBay final value fees and net payout for your listings." category="finance">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="ef-price">Sale Price ($)</label>
            <input id="ef-price" type="number" min="0" step="0.01" placeholder="50.00" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="ef-ship">Shipping ($)</label>
            <input id="ef-ship" type="number" min="0" step="0.01" placeholder="0.00" value={shipping} onChange={e => setShipping(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 2, minWidth: 180 }}>
            <label htmlFor="ef-cat">Category</label>
            <select id="ef-cat" value={catIdx} onChange={e => setCatIdx(Number(e.target.value))} style={{ width: '100%' }}>
              {CATEGORIES.map((c, i) => <option key={i} value={i}>{c.label} ({c.pct}%)</option>)}
            </select>
          </div>
        </div>
        {ready && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>${fvf.toFixed(2)}</div><div className={styles.statLabel}>Final value fee</div></div>
            <div className={styles.stat}><div className={styles.statNum}>${paymentFee.toFixed(2)}</div><div className={styles.statLabel}>Payment fee (~3%)</div></div>
            <div className={styles.stat}><div className={styles.statNum}>${total.toFixed(2)}</div><div className={styles.statLabel}>Total fees</div></div>
            <div className={styles.stat}><div className={styles.statNum} style={{ color: net > 0 ? 'var(--accent)' : '#e55' }}>${net.toFixed(2)}</div><div className={styles.statLabel}>Net payout</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
