import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './gaming.module.css';

const ADJ = ['Shadow','Neon','Dark','Hyper','Nova','Pixel','Blaze','Storm','Ghost','Cyber','Toxic','Rogue','Elite','Frost','Iron','Chaos','Void','Ultra'];
const NOUNS = ['Wolf','Eagle','Viper','Fox','Dragon','Titan','Raven','Phoenix','Hawk','Golem','Wraith','Specter','Hunter','Archer','Blade','Knight','Ninja','Samurai'];
const SUFFIXES = ['','_Pro','_GG','_X','_YT','_TV','_xD','99','77','00'];

function randItem<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function GamingName() {
  const [seed, setSeed] = useState('');
  const [count, setCount] = useState(10);
  const [names, setNames] = useState<string[]>([]);

  function generate() {
    if (seed.trim()) {
      const base = seed.replace(/\s+/g, '');
      setNames(Array.from({ length: count }, () => base + randItem(SUFFIXES)));
    } else {
      setNames(Array.from({ length: count }, () => randItem(ADJ) + randItem(NOUNS) + randItem(SUFFIXES)));
    }
  }

  return (
    <ConverterShell title="Gaming Name Generator" description="Generate cool gamertags and usernames for online play." category="gaming">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 2, minWidth: 160 }}>
            <label htmlFor="gn-seed">Keyword (optional)</label>
            <input id="gn-seed" type="text" placeholder="Leave blank for random" value={seed} onChange={e => setSeed(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}>
            <label>Count: {count}</label>
            <input type="range" min={5} max={20} value={count} onChange={e => setCount(Number(e.target.value))} />
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={generate}>Generate Names</button>
        </div>
        {names.length > 0 && (
          <div className={styles.grid}>
            {names.map((n, i) => (
              <div key={i} className={styles.card} style={{ cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(n)}>
                <div className={styles.cardValue} style={{ fontFamily: 'var(--font-mono)' }}>{n}</div>
                <div className={styles.cardLabel}>click to copy</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
