import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './random.module.css';

export default function RandomNumber() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([]);

  function generate() {
    const lo = parseInt(min), hi = parseInt(max), n = Math.min(parseInt(count), 500);
    if (isNaN(lo) || isNaN(hi) || lo >= hi) return;
    if (unique) {
      const pool = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      setResults(pool.slice(0, Math.min(n, pool.length)));
    } else {
      setResults(Array.from({ length: n }, () => Math.floor(Math.random() * (hi - lo + 1)) + lo));
    }
  }

  return (
    <ConverterShell title="Random Number Generator" description="Generate one or more random numbers in any range." category="random">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[['Min', min, setMin], ['Max', max, setMax], ['Count', count, setCount]].map(([label, val, setter]) => (
            <div key={String(label)} className={styles.field} style={{ flex: 1, minWidth: 80 }}>
              <label>{label as string}</label>
              <input type="number" value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} />
            </div>
          ))}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)} /> No duplicates
        </label>
        <div className={styles.actions}>
          <button onClick={generate}>Generate</button>
          <button onClick={() => setResults([])}>Clear</button>
        </div>
        {results.length === 1 && (
          <div style={{ textAlign: 'center', fontSize: '4rem', fontWeight: 700, color: 'var(--accent)', padding: '1rem' }}>{results[0]}</div>
        )}
        {results.length > 1 && (
          <div className={styles.outputArea}>{results.join(', ')}</div>
        )}
      </div>
    </ConverterShell>
  );
}
