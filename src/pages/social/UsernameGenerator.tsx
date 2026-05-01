import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './social.module.css';

const ADJECTIVES = ['Swift','Dark','Neon','Shadow','Pixel','Cosmic','Blaze','Storm','Ghost','Nova','Prime','Void','Hyper','Iron','Silver','Golden','Phantom','Ultra'];
const NOUNS = ['Wolf','Eagle','Fox','Tiger','Falcon','Hawk','Raven','Phoenix','Viper','Dragon','Bear','Shark','Lion','Panda','Goat','Blade','Storm','Byte'];
const STYLES_LIST = [
  (adj: string, noun: string) => `${adj}${noun}`,
  (adj: string, noun: string) => `${adj}_${noun}`,
  (adj: string, noun: string) => `${adj}${noun}${Math.floor(Math.random() * 99 + 1)}`,
  (adj: string, noun: string) => `x_${adj.toLowerCase()}${noun.toLowerCase()}`,
  (adj: string, noun: string) => `${noun}${adj}`,
];

function randItem<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

function generate(n: number) {
  return Array.from({ length: n }, () => {
    const adj = randItem(ADJECTIVES);
    const noun = randItem(NOUNS);
    return randItem(STYLES_LIST)(adj, noun);
  });
}

export default function UsernameGenerator() {
  const [seed, setSeed] = useState('');
  const [count, setCount] = useState(10);
  const [results, setResults] = useState<string[]>([]);

  function go() {
    if (seed.trim()) {
      const words = seed.split(/\s+/).filter(Boolean);
      const base = words.join('');
      setResults(Array.from({ length: count }, (_, i) => {
        const suffix = i === 0 ? '' : String(Math.floor(Math.random() * 999));
        return `${base}${suffix}`;
      }));
    } else {
      setResults(generate(count));
    }
  }

  return (
    <ConverterShell title="Username Generator" description="Generate unique usernames for social media, gaming, and streaming profiles." category="social">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 2, minWidth: 160 }}>
            <label htmlFor="ug-seed">Keyword (optional)</label>
            <input id="ug-seed" type="text" placeholder="Leave blank for random" value={seed} onChange={e => setSeed(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}>
            <label htmlFor="ug-count">Count: {count}</label>
            <input id="ug-count" type="range" min={5} max={20} value={count} onChange={e => setCount(Number(e.target.value))} />
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={go}>Generate Usernames</button>
        </div>
        {results.length > 0 && (
          <div className={styles.grid}>
            {results.map((r, i) => (
              <div key={i} className={styles.card} style={{ cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(r)}>
                <div className={styles.cardValue} style={{ fontFamily: 'var(--font-mono)' }}>{r}</div>
                <div className={styles.cardLabel}>click to copy</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
