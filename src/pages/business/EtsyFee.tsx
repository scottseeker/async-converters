import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './business.module.css';

// Etsy fee structure (2024): listing $0.20, transaction 6.5%, payment 3% + $0.25
export default function EtsyFee() {
  const [price, setPrice] = useState('');
  const [shipping, setShipping] = useState('');

  const p = parseFloat(price) || 0;
  const s = parseFloat(shipping) || 0;
  const listing = 0.20;
  const transaction = (p + s) * 0.065;
  const payment = p * 0.03 + 0.25;
  const total = listing + transaction + payment;
  const net = p - total;

  const ready = p > 0;

  return (
    <ConverterShell title="Etsy Fee Calculator" description="Estimate Etsy listing, transaction, and payment processing fees." category="finance">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="etsy-price">Listing Price ($)</label>
            <input id="etsy-price" type="number" min="0" step="0.01" placeholder="25.00" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="etsy-ship">Shipping ($)</label>
            <input id="etsy-ship" type="number" min="0" step="0.01" placeholder="0.00" value={shipping} onChange={e => setShipping(e.target.value)} />
          </div>
        </div>
        {ready && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>${listing.toFixed(2)}</div><div className={styles.statLabel}>Listing fee</div></div>
            <div className={styles.stat}><div className={styles.statNum}>${transaction.toFixed(2)}</div><div className={styles.statLabel}>Transaction (6.5%)</div></div>
            <div className={styles.stat}><div className={styles.statNum}>${payment.toFixed(2)}</div><div className={styles.statLabel}>Payment proc.</div></div>
            <div className={styles.stat}><div className={styles.statNum}>${total.toFixed(2)}</div><div className={styles.statLabel}>Total fees</div></div>
            <div className={styles.stat}><div className={styles.statNum} style={{ color: net > 0 ? 'var(--accent)' : '#e55' }}>${net.toFixed(2)}</div><div className={styles.statLabel}>Net payout</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
