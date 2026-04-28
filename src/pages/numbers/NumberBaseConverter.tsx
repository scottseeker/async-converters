import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './numbers.module.css';

const BASES = [
  { id: 2,  label: 'Binary (Base 2)',   prefix: '0b' },
  { id: 8,  label: 'Octal (Base 8)',    prefix: '0o' },
  { id: 10, label: 'Decimal (Base 10)', prefix: ''   },
  { id: 16, label: 'Hex (Base 16)',     prefix: '0x' },
];

export default function NumberBaseConverter() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [error, setError] = useState('');

  const decimal = (() => {
    if (!input.trim()) return null;
    const n = parseInt(input.trim(), fromBase);
    return isNaN(n) ? null : n;
  })();

  function handleInput(v: string) {
    setInput(v);
    setError('');
    const n = parseInt(v.trim(), fromBase);
    if (v.trim() && isNaN(n)) setError(`Invalid number for base ${fromBase}`);
  }

  return (
    <ConverterShell title="Number Base Converter" description="Convert numbers between binary, octal, decimal, and hexadecimal." category="numbers">
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="num-input">Number</label>
            <input id="num-input" type="text" placeholder="Enter number…" value={input} onChange={e => handleInput(e.target.value)} />
            {error && <span className={styles.error}>{error}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="from-base">Input Base</label>
            <select id="from-base" value={fromBase} onChange={e => setFromBase(Number(e.target.value))}>
              {BASES.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
            </select>
          </div>
        </div>

        {decimal !== null && (
          <div className={styles.bases}>
            {BASES.map(b => (
              <div key={b.id} className={styles.resultBox}>
                <div className={styles.resultLabel}>{b.label}</div>
                <div className={styles.resultValue}>{b.prefix}{decimal.toString(b.id).toUpperCase()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
