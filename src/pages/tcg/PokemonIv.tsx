import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './tcg.module.css';

function calcIv(stat: number, baseStat: number, level: number, isHp: boolean) {
  if (isHp) return Math.round(((stat - level - 10) * 100 / level) - 2 * baseStat);
  return Math.round(((stat - 5) * 100 / level) - 2 * baseStat);
}

export default function PokemonIv() {
  const [statVal, setStatVal] = useState('');
  const [base, setBase] = useState('');
  const [level, setLevel] = useState('50');
  const [isHp, setIsHp] = useState(false);

  const s = parseInt(statVal);
  const b = parseInt(base);
  const lv = parseInt(level) || 50;
  const iv = !isNaN(s) && !isNaN(b) ? calcIv(s, b, lv, isHp) : null;
  const clamped = iv !== null ? Math.max(0, Math.min(31, iv)) : null;

  return (
    <ConverterShell title="Pokémon IV Estimator" description="Estimate a Pokémon's Individual Values (IVs) from its stat, base stat, and level." category="tcg">
      <div className={styles.form}>
        <label className={styles.checkRow}>
          <input type="checkbox" checked={isHp} onChange={e => setIsHp(e.target.checked)} />
          HP stat (uses different formula)
        </label>
        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Actual stat value</label>
            <input type="number" min={1} placeholder="150" value={statVal} onChange={e => setStatVal(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Base stat</label>
            <input type="number" min={1} placeholder="45" value={base} onChange={e => setBase(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}>
            <label>Level</label>
            <input type="number" min={1} max={100} placeholder="50" value={level} onChange={e => setLevel(e.target.value)} />
          </div>
        </div>
        {clamped !== null && (
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNum} style={{ color: clamped >= 28 ? 'var(--accent)' : clamped >= 20 ? undefined : '#e55' }}>
                {clamped} / 31
              </div>
              <div className={styles.statLabel}>Estimated IV</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>
                {clamped >= 28 ? '⭐ Excellent' : clamped >= 20 ? 'Good' : clamped >= 10 ? 'OK' : 'Poor'}
              </div>
              <div className={styles.statLabel}>Rating</div>
            </div>
          </div>
        )}
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Note: EVs and nature modifiers are not factored into this simplified estimate.
        </p>
      </div>
    </ConverterShell>
  );
}
