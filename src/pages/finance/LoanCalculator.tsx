import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './finance.module.css';

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');

  const P = parseFloat(principal);
  const r = parseFloat(rate) / 100 / 12;
  const n = parseFloat(years) * 12;

  let monthly = 0, totalPayment = 0, totalInterest = 0;
  const valid = P > 0 && r > 0 && n > 0;
  if (valid) {
    monthly = (P * r * Math.pow(1+r,n)) / (Math.pow(1+r,n) - 1);
    totalPayment = monthly * n;
    totalInterest = totalPayment - P;
  }

  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ConverterShell title="Loan Calculator" description="Calculate monthly loan payments and total interest." category="finance">
      <div className={styles.form}>
        <div className={styles.row3}>
          <div className={styles.field}><label htmlFor="loan-p">Loan Amount ($)</label><input id="loan-p" type="number" min={0} placeholder="e.g. 250000" value={principal} onChange={e => setPrincipal(e.target.value)} /></div>
          <div className={styles.field}><label htmlFor="loan-r">Annual Rate (%)</label><input id="loan-r" type="number" min={0} step="0.01" placeholder="e.g. 6.5" value={rate} onChange={e => setRate(e.target.value)} /></div>
          <div className={styles.field}><label htmlFor="loan-y">Term (years)</label><input id="loan-y" type="number" min={1} placeholder="e.g. 30" value={years} onChange={e => setYears(e.target.value)} /></div>
        </div>

        {valid && (
          <div className={styles.row3}>
            {[
              { label: 'Monthly Payment', value: `$${fmt(monthly)}` },
              { label: 'Total Payment',   value: `$${fmt(totalPayment)}` },
              { label: 'Total Interest',  value: `$${fmt(totalInterest)}` },
            ].map(r => (
              <div key={r.label} className={styles.resultBox}>
                <div className={styles.resultLabel}>{r.label}</div>
                <div className={styles.resultValue}>{r.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
