import { useEffect, useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './finance.module.css';

interface Rates { base: string; rates: Record<string, number>; }

export default function CurrencyConverter() {
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => {
        if (d.result === 'success') setRates({ base: 'USD', rates: d.rates });
        else setError('Failed to load rates');
      })
      .catch(() => setError('Network error loading exchange rates'))
      .finally(() => setLoading(false));
  }, []);

  const currencies = rates ? Object.keys(rates.rates).sort() : [];

  const result = (() => {
    if (!rates) return '';
    const n = parseFloat(amount);
    if (isNaN(n)) return 'Invalid amount';
    const inUsd = n / (rates.rates[from] ?? 1);
    const converted = inUsd * (rates.rates[to] ?? 1);
    return `${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${to}`;
  })();

  return (
    <ConverterShell title="Currency Converter" description="Convert between world currencies using live exchange rates." category="finance">
      <div className={styles.form}>
        {loading && <p style={{ color: 'var(--text-muted)' }}>Loading live rates…</p>}
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
        {rates && (
          <>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="curr-amount">Amount</label>
                <input id="curr-amount" type="number" min="0" step="any" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="from-curr">From</label>
                <select id="from-curr" value={from} onChange={e => setFrom(e.target.value)}>
                  {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="to-curr">To</label>
                <select id="to-curr" value={to} onChange={e => setTo(e.target.value)}>
                  {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.resultBox}>
              <div className={styles.resultLabel}>Result</div>
              <div className={styles.resultValue}>{result}</div>
              <div className={styles.note} style={{ marginTop: '0.4rem' }}>Rates via open.er-api.com (updated daily)</div>
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
