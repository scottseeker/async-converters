import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './business.module.css';

// PayPal fee structure (standard): 3.49% + $0.49 domestic
const RATES = [
  { label: 'Domestic (US)', pct: 3.49, fixed: 0.49 },
  { label: 'International', pct: 4.99, fixed: 0.49 },
  { label: 'Goods & Services', pct: 2.99, fixed: 0.49 },
];

export default function PaypalFee() {
  const [amount, setAmount] = useState('');
  const [rateIdx, setRateIdx] = useState(0);
  const [mode, setMode] = useState<'charge' | 'receive'>('receive');

  const a = parseFloat(amount);
  const { pct, fixed } = RATES[rateIdx];

  let fee: number | null = null;
  let result: number | null = null;
  if (!isNaN(a)) {
    if (mode === 'receive') {
      fee = a * (pct / 100) + fixed;
      result = a - fee;
    } else {
      // Amount to charge so customer pays 'a' and you receive 'a' after fees
      result = (a + fixed) / (1 - pct / 100);
      fee = result - a;
    }
  }

  return (
    <ConverterShell title="PayPal Fee Calculator" description="Calculate PayPal fees so you receive the exact amount you need." category="finance">
      <div className={styles.form}>
        <div className={styles.actions}>
          <button style={mode === 'receive' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode('receive')}>I'll receive</button>
          <button style={mode === 'charge' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode('charge')}>I need to receive</button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="pp-amt">{mode === 'receive' ? 'Amount sent ($)' : 'Amount you want ($)'}</label>
            <input id="pp-amt" type="number" min="0" step="0.01" placeholder="100.00" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 180 }}>
            <label htmlFor="pp-rate">Fee structure</label>
            <select id="pp-rate" value={rateIdx} onChange={e => setRateIdx(Number(e.target.value))} style={{ width: '100%' }}>
              {RATES.map((r, i) => <option key={i} value={i}>{r.label} ({r.pct}% + ${r.fixed})</option>)}
            </select>
          </div>
        </div>
        {fee !== null && result !== null && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>${fee.toFixed(2)}</div><div className={styles.statLabel}>PayPal fee</div></div>
            <div className={styles.stat}><div className={styles.statNum}>${result.toFixed(2)}</div><div className={styles.statLabel}>{mode === 'receive' ? 'You receive' : 'Charge customer'}</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
