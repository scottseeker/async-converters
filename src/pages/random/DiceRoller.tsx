import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './random.module.css';

const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100];

export default function DiceRoller() {
  const [sides, setSides] = useState(6);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);

  function roll() {
    setResults(Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1));
  }

  const total = results.reduce((a, b) => a + b, 0);

  return (
    <ConverterShell title="Dice Roller" description="Roll any combination of dice: d4, d6, d8, d10, d12, d20, d100." category="random">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {DICE_TYPES.map(d => (
            <button key={d} style={sides === d ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setSides(d)}>d{d}</button>
          ))}
        </div>
        <div className={styles.field} style={{ maxWidth: 200 }}>
          <label>Number of dice: {count}</label>
          <input type="range" min={1} max={20} value={count} onChange={e => setCount(Number(e.target.value))} />
        </div>
        <div className={styles.actions}>
          <button onClick={roll}>🎲 Roll {count}d{sides}</button>
        </div>
        {results.length > 0 && (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
              {results.map((r, i) => (
                <div key={i} style={{
                  width: 56, height: 56, borderRadius: 10, background: 'var(--accent)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>{r}</div>
              ))}
            </div>
            {count > 1 && <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total: <strong>{total}</strong> | Average: <strong>{(total / count).toFixed(1)}</strong></div>}
          </>
        )}
      </div>
    </ConverterShell>
  );
}
