import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import { fromRoman, toRoman } from '../../converters/numbers/roman';
import styles from './numbers.module.css';

export default function RomanNumeralsConverter() {
  const [num, setNum] = useState('');
  const [roman, setRoman] = useState('');

  const numResult = num ? toRoman(parseInt(num, 10)) : '';
  const romanResult = roman ? fromRoman(roman).toString() : '';

  return (
    <ConverterShell title="Roman Numerals Converter" description="Convert between integers and Roman numerals (1–3999)." category="numbers">
      <div className={styles.form}>
        <div className={styles.row}>
          <div>
            <div className={styles.field} style={{ marginBottom: '0.75rem' }}>
              <label htmlFor="num-r">Integer (1–3999)</label>
              <input id="num-r" type="number" min={1} max={3999} placeholder="e.g. 2024" value={num} onChange={e => setNum(e.target.value)} />
            </div>
            {numResult && (
              <div className={styles.resultBox}>
                <div className={styles.resultLabel}>Roman Numeral</div>
                <div className={styles.resultValue}>{numResult}</div>
              </div>
            )}
          </div>
          <div>
            <div className={styles.field} style={{ marginBottom: '0.75rem' }}>
              <label htmlFor="rom-r">Roman Numeral</label>
              <input id="rom-r" type="text" placeholder="e.g. MMXXIV" value={roman} onChange={e => setRoman(e.target.value)} />
            </div>
            {romanResult && (
              <div className={styles.resultBox}>
                <div className={styles.resultLabel}>Integer</div>
                <div className={styles.resultValue}>{romanResult}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConverterShell>
  );
}
