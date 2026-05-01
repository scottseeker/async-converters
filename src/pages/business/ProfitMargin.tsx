import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './business.module.css';

export default function ProfitMargin() {
  const [cost, setCost] = useState('');
  const [revenue, setRevenue] = useState('');

  const c = parseFloat(cost);
  const r = parseFloat(revenue);
  const profit = !isNaN(c) && !isNaN(r) ? r - c : null;
  const margin = profit !== null && r ? ((profit / r) * 100).toFixed(2) : null;
  const markup = profit !== null && c ? ((profit / c) * 100).toFixed(2) : null;

  return (
    <ConverterShell title="Profit Margin Calculator" description="Calculate profit, margin percentage, and markup from cost and revenue." category="finance">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="pm-cost">Cost ($)</label>
            <input id="pm-cost" type="number" min="0" step="0.01" placeholder="0.00" value={cost} onChange={e => setCost(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="pm-rev">Revenue / Price ($)</label>
            <input id="pm-rev" type="number" min="0" step="0.01" placeholder="0.00" value={revenue} onChange={e => setRevenue(e.target.value)} />
          </div>
        </div>
        {profit !== null && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>${profit.toFixed(2)}</div><div className={styles.statLabel}>Profit</div></div>
            <div className={styles.stat}><div className={styles.statNum}>{margin}%</div><div className={styles.statLabel}>Margin</div></div>
            <div className={styles.stat}><div className={styles.statNum}>{markup}%</div><div className={styles.statLabel}>Markup</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
