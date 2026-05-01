import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './business.module.css';

export default function RoiCalculator() {
  const [invest, setInvest] = useState('');
  const [gain, setGain] = useState('');

  const i = parseFloat(invest);
  const g = parseFloat(gain);
  const net = !isNaN(i) && !isNaN(g) ? g - i : null;
  const roi = net !== null && i ? ((net / i) * 100).toFixed(2) : null;

  return (
    <ConverterShell title="ROI Calculator" description="Calculate return on investment (ROI) and net profit from your investment." category="finance">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="roi-inv">Investment ($)</label>
            <input id="roi-inv" type="number" min="0" step="0.01" placeholder="1000.00" value={invest} onChange={e => setInvest(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="roi-gain">Total Gain ($)</label>
            <input id="roi-gain" type="number" min="0" step="0.01" placeholder="1250.00" value={gain} onChange={e => setGain(e.target.value)} />
          </div>
        </div>
        {net !== null && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>${net.toFixed(2)}</div><div className={styles.statLabel}>Net Profit</div></div>
            <div className={styles.stat}><div className={styles.statNum} style={{ color: parseFloat(roi ?? '0') >= 0 ? 'var(--accent)' : '#e55' }}>{roi}%</div><div className={styles.statLabel}>ROI</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
