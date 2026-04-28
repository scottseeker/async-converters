import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './finance.module.css';

export default function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tipPct, setTipPct] = useState('18');
  const [people, setPeople] = useState('1');

  const billN = parseFloat(bill) || 0;
  const pct = parseFloat(tipPct) || 0;
  const n = parseInt(people, 10) || 1;

  const tipAmount = billN * pct / 100;
  const total = billN + tipAmount;
  const perPerson = total / n;

  return (
    <ConverterShell title="Tip Calculator" description="Calculate tip amount and split the bill between people." category="finance">
      <div className={styles.form}>
        <div className={styles.row3}>
          <div className={styles.field}><label htmlFor="tip-bill">Bill Amount ($)</label><input id="tip-bill" type="number" min={0} step="0.01" placeholder="0.00" value={bill} onChange={e => setBill(e.target.value)} /></div>
          <div className={styles.field}><label htmlFor="tip-pct">Tip %</label><input id="tip-pct" type="number" min={0} max={100} value={tipPct} onChange={e => setTipPct(e.target.value)} /></div>
          <div className={styles.field}><label htmlFor="tip-people">People</label><input id="tip-people" type="number" min={1} max={100} value={people} onChange={e => setPeople(e.target.value)} /></div>
        </div>

        {bill && (
          <div className={styles.row3}>
            {[
              { label: 'Tip Amount', value: `$${tipAmount.toFixed(2)}` },
              { label: 'Total Bill', value: `$${total.toFixed(2)}` },
              { label: `Per Person (${n})`, value: `$${perPerson.toFixed(2)}` },
            ].map(r => (
              <div key={r.label} className={styles.resultBox}>
                <div className={styles.resultLabel}>{r.label}</div>
                <div className={styles.resultValue}>{r.value}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[10, 15, 18, 20, 25].map(p => (
            <button key={p} className={tipPct === String(p) ? 'btn-primary' : 'btn-secondary'} onClick={() => setTipPct(String(p))}>
              {p}%
            </button>
          ))}
        </div>
      </div>
    </ConverterShell>
  );
}
