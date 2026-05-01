import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './gaming.module.css';

const ENCHANTS: Record<string, { levels: number; cost: number[] }> = {
  'Sharpness': { levels: 5, cost: [1,2,3,4,5] },
  'Unbreaking': { levels: 3, cost: [2,4,6] },
  'Efficiency': { levels: 5, cost: [1,2,3,4,5] },
  'Protection': { levels: 4, cost: [1,2,3,4] },
  'Fortune': { levels: 3, cost: [3,6,9] },
  'Silk Touch': { levels: 1, cost: [4] },
  'Looting': { levels: 3, cost: [3,6,9] },
  'Power': { levels: 5, cost: [1,2,3,4,5] },
  'Flame': { levels: 1, cost: [2] },
  'Infinity': { levels: 1, cost: [8] },
};

export default function MinecraftEnchant() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(name: string) {
    setSelected(s => s.includes(name) ? s.filter(x => x !== name) : [...s, name]);
  }

  const totalCost = selected.reduce((sum, name) => {
    const e = ENCHANTS[name];
    return sum + (e ? e.cost[e.levels - 1] : 0);
  }, 0);

  return (
    <ConverterShell title="Minecraft Enchantment Planner" description="Plan your enchantments and calculate the total XP level cost." category="gaming">
      <div className={styles.form}>
        <div className={styles.grid}>
          {Object.entries(ENCHANTS).map(([name, e]) => (
            <div
              key={name}
              className={styles.card}
              style={{ cursor: 'pointer', borderColor: selected.includes(name) ? 'var(--accent)' : undefined, opacity: selected.includes(name) ? 1 : 0.7 }}
              onClick={() => toggle(name)}
            >
              <div className={styles.cardLabel}>{name}</div>
              <div className={styles.cardValue}>Max lvl {e.levels}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{e.cost[e.levels - 1]} XP levels</div>
            </div>
          ))}
        </div>
        {selected.length > 0 && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>{selected.length}</div><div className={styles.statLabel}>Enchantments</div></div>
            <div className={styles.stat}><div className={styles.statNum}>{totalCost}</div><div className={styles.statLabel}>Approx. XP levels</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
