import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);

  function generate() {
    let pool = '';
    if (upper) pool += CHARS.upper;
    if (lower) pool += CHARS.lower;
    if (numbers) pool += CHARS.numbers;
    if (symbols) pool += CHARS.symbols;
    if (!pool) return;
    const arr = new Uint32Array(length * count);
    crypto.getRandomValues(arr);
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(Array.from({ length }, (_, j) => pool[arr[i * length + j] % pool.length]).join(''));
    }
    setPasswords(result);
  }

  return (
    <ConverterShell title="Password Generator" description="Generate strong, random passwords with configurable rules." category="developer">
      <div className={styles.form}>
        <div className={styles.field} style={{ maxWidth: 260 }}>
          <label>Length: {length}</label>
          <input type="range" min={4} max={128} value={length} onChange={e => setLength(Number(e.target.value))} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[['Uppercase', upper, setUpper], ['Lowercase', lower, setLower], ['Numbers', numbers, setNumbers], ['Symbols', symbols, setSymbols]].map(([label, val, setter]) => (
            <label key={String(label)} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as (v: boolean) => void)(e.target.checked)} /> {label as string}
            </label>
          ))}
        </div>
        <div className={styles.field} style={{ maxWidth: 180 }}>
          <label>Count: {count}</label>
          <input type="range" min={1} max={20} value={count} onChange={e => setCount(Number(e.target.value))} />
        </div>
        <div className={styles.actions}><button onClick={generate}>Generate</button></div>
        {passwords.length > 0 && passwords.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <code style={{ flex: 1, background: 'var(--bg-card)', padding: '0.5rem 0.75rem', borderRadius: 6, fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{p}</code>
            <button style={{ flexShrink: 0 }} onClick={() => navigator.clipboard.writeText(p)}>Copy</button>
          </div>
        ))}
      </div>
    </ConverterShell>
  );
}
