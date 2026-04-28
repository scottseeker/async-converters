import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './numbers.module.css';

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

function decimalToFraction(d: number): string {
  if (!Number.isFinite(d)) return 'Invalid';
  const str = d.toString();
  const decimals = (str.split('.')[1] ?? '').length;
  const denom = Math.pow(10, decimals);
  const numer = Math.round(d * denom);
  const g = gcd(Math.abs(numer), denom);
  return `${numer / g}/${denom / g}`;
}

function fractionToDecimal(f: string): string {
  const parts = f.split('/');
  if (parts.length !== 2) return 'Enter as numerator/denominator';
  const [n, d] = parts.map(p => parseFloat(p.trim()));
  if (isNaN(n) || isNaN(d) || d === 0) return 'Invalid fraction';
  return (n / d).toString();
}

export default function FractionDecimalConverter() {
  const [dec, setDec] = useState('');
  const [frac, setFrac] = useState('');

  const decResult = dec ? decimalToFraction(parseFloat(dec)) : '';
  const fracResult = frac ? fractionToDecimal(frac) : '';

  return (
    <ConverterShell title="Fraction ↔ Decimal" description="Convert between fractions and decimal numbers." category="numbers">
      <div className={styles.form}>
        <div className={styles.row}>
          <div>
            <div className={styles.field} style={{ marginBottom: '0.75rem' }}>
              <label htmlFor="dec-f">Decimal</label>
              <input id="dec-f" type="number" step="any" placeholder="e.g. 0.75" value={dec} onChange={e => setDec(e.target.value)} />
            </div>
            {decResult && (
              <div className={styles.resultBox}>
                <div className={styles.resultLabel}>Fraction</div>
                <div className={styles.resultValue}>{decResult}</div>
              </div>
            )}
          </div>
          <div>
            <div className={styles.field} style={{ marginBottom: '0.75rem' }}>
              <label htmlFor="frac-in">Fraction (a/b)</label>
              <input id="frac-in" type="text" placeholder="e.g. 3/4" value={frac} onChange={e => setFrac(e.target.value)} />
            </div>
            {fracResult && (
              <div className={styles.resultBox}>
                <div className={styles.resultLabel}>Decimal</div>
                <div className={styles.resultValue}>{fracResult}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConverterShell>
  );
}
