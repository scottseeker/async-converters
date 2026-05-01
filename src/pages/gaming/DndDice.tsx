import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './gaming.module.css';

const DICE = [4, 6, 8, 10, 12, 20, 100];

interface DiceRoll { die: number; count: number; mod: number; }

export default function DndDice() {
  const [rolls, setRolls] = useState<DiceRoll[]>([{ die: 20, count: 1, mod: 0 }]);
  const [results, setResults] = useState<{ die: number; values: number[]; mod: number }[]>([]);

  function addRoll() { setRolls([...rolls, { die: 6, count: 1, mod: 0 }]); }
  function update(i: number, k: keyof DiceRoll, v: number) {
    setRolls(rolls.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  }

  function rollAll() {
    setResults(rolls.map(r => ({
      die: r.die,
      mod: r.mod,
      values: Array.from({ length: Math.max(1, r.count) }, () => Math.floor(Math.random() * r.die) + 1),
    })));
  }

  const grandTotal = results.reduce((s, r) => s + r.values.reduce((a, b) => a + b, 0) + r.mod, 0);

  return (
    <ConverterShell title="D&D Dice Roller" description="Roll any combination of RPG dice with modifiers." category="gaming">
      <div className={styles.form}>
        {rolls.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
            <div className={styles.field} style={{ minWidth: 60 }}>
              <label>Count</label>
              <input type="number" min={1} max={20} value={r.count} onChange={e => update(i, 'count', Number(e.target.value))} style={{ width: 60 }} />
            </div>
            <div className={styles.field}>
              <label>Die</label>
              <select value={r.die} onChange={e => update(i, 'die', Number(e.target.value))}>
                {DICE.map(d => <option key={d} value={d}>d{d}</option>)}
              </select>
            </div>
            <div className={styles.field} style={{ minWidth: 70 }}>
              <label>+/− Mod</label>
              <input type="number" value={r.mod} onChange={e => update(i, 'mod', Number(e.target.value))} style={{ width: 70 }} />
            </div>
            <button onClick={() => setRolls(rolls.filter((_, idx) => idx !== i))} disabled={rolls.length === 1} style={{ marginBottom: 2 }}>✕</button>
          </div>
        ))}
        <div className={styles.actions}>
          <button onClick={addRoll}>+ Add die</button>
          <button onClick={rollAll} style={{ background: 'var(--accent)', color: '#fff' }}>🎲 Roll!</button>
        </div>
        {results.length > 0 && (
          <>
            {results.map((r, i) => (
              <div key={i} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <strong>{r.values.length}d{r.die}{r.mod !== 0 ? (r.mod > 0 ? `+${r.mod}` : r.mod) : ''}:</strong>{' '}
                [{r.values.join(', ')}]{r.mod !== 0 ? ` + ${r.mod}` : ''} = <strong>{r.values.reduce((a, b) => a + b, 0) + r.mod}</strong>
              </div>
            ))}
            {results.length > 1 && (
              <div className={styles.stats}>
                <div className={styles.stat}><div className={styles.statNum}>{grandTotal}</div><div className={styles.statLabel}>Grand Total</div></div>
              </div>
            )}
          </>
        )}
      </div>
    </ConverterShell>
  );
}
