import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './business.module.css';

export default function CommissionCalculator() {
  const [sale, setSale] = useState('');
  const [rate, setRate] = useState('');
  const [base, setBase] = useState('');

  const s = parseFloat(sale);
  const r = parseFloat(rate) / 100;
  const b = parseFloat(base) || 0;
  const commission = !isNaN(s) && !isNaN(r) ? s * r : null;
  const total = commission !== null ? b + commission : null;

  return (
    <ConverterShell title="Commission Calculator" description="Calculate sales commission with optional base salary." category="finance">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="cc-sale">Sale Amount ($)</label>
            <input id="cc-sale" type="number" min="0" step="0.01" placeholder="5000.00" value={sale} onChange={e => setSale(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label htmlFor="cc-rate">Commission Rate (%)</label>
            <input id="cc-rate" type="number" min="0" step="0.1" placeholder="10" value={rate} onChange={e => setRate(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="cc-base">Base Salary ($)</label>
            <input id="cc-base" type="number" min="0" step="0.01" placeholder="0.00" value={base} onChange={e => setBase(e.target.value)} />
          </div>
        </div>
        {commission !== null && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>${commission.toFixed(2)}</div><div className={styles.statLabel}>Commission</div></div>
            <div className={styles.stat}><div className={styles.statNum}>${total!.toFixed(2)}</div><div className={styles.statLabel}>Total earnings</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
