import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './numbers.module.css';

export default function ScientificNotationConverter() {
  const [decimal, setDecimal] = useState('');
  const [sci, setSci] = useState('');

  const decToSci = (() => {
    if (!decimal.trim()) return '';
    const n = parseFloat(decimal);
    if (isNaN(n)) return 'Invalid number';
    return n.toExponential();
  })();

  const sciToDec = (() => {
    if (!sci.trim()) return '';
    const n = parseFloat(sci);
    if (isNaN(n)) return 'Invalid notation';
    // Format as fixed if not too large/small
    if (Math.abs(n) < 1e15 && Math.abs(n) > 1e-7) return n.toString();
    return n.toFixed(20).replace(/\.?0+$/, '');
  })();

  return (
    <ConverterShell title="Scientific Notation" description="Convert between standard decimal numbers and scientific notation." category="numbers">
      <div className={styles.form}>
        <div className={styles.row}>
          <div>
            <div className={styles.field} style={{ marginBottom: '0.75rem' }}>
              <label htmlFor="dec-sci">Decimal Number</label>
              <input id="dec-sci" type="text" placeholder="e.g. 0.00042" value={decimal} onChange={e => setDecimal(e.target.value)} />
            </div>
            {decToSci && (
              <div className={styles.resultBox}>
                <div className={styles.resultLabel}>Scientific Notation</div>
                <div className={styles.resultValue}>{decToSci}</div>
              </div>
            )}
          </div>
          <div>
            <div className={styles.field} style={{ marginBottom: '0.75rem' }}>
              <label htmlFor="sci-in">Scientific Notation</label>
              <input id="sci-in" type="text" placeholder="e.g. 4.2e-4" value={sci} onChange={e => setSci(e.target.value)} />
            </div>
            {sciToDec && (
              <div className={styles.resultBox}>
                <div className={styles.resultLabel}>Decimal</div>
                <div className={styles.resultValue}>{sciToDec}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConverterShell>
  );
}
