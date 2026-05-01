import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './dnd.module.css';

// 5e XP thresholds per character level [easy, medium, hard, deadly]
const XP_THRESHOLDS: Record<number, [number, number, number, number]> = {
  1:  [25,   50,   75,   100],
  2:  [50,   100,  150,  200],
  3:  [75,   150,  225,  400],
  4:  [125,  250,  375,  500],
  5:  [250,  500,  750,  1100],
  6:  [300,  600,  900,  1400],
  7:  [350,  750,  1100, 1700],
  8:  [450,  900,  1400, 2100],
  9:  [550,  1100, 1600, 2400],
  10: [600,  1200, 1900, 2800],
  11: [800,  1600, 2400, 3600],
  12: [1000, 2000, 3000, 4500],
  13: [1100, 2200, 3400, 5100],
  14: [1250, 2500, 3800, 5700],
  15: [1400, 2800, 4300, 6400],
  16: [1600, 3200, 4800, 7200],
  17: [2000, 3900, 5900, 8800],
  18: [2100, 4200, 6300, 9500],
  19: [2400, 4900, 7300, 10900],
  20: [2800, 5700, 8500, 12700],
};

// Monster XP by CR
const CR_XP: [number|string, number][] = [
  ['0',5],['1/8',25],['1/4',50],['1/2',100],
  [1,200],[2,450],[3,700],[4,1100],[5,1800],
  [6,2300],[7,2900],[8,3900],[9,5000],[10,5900],
  [11,7200],[12,8400],[13,10000],[14,11500],[15,13000],
  [16,15000],[17,18000],[18,20000],[19,22000],[20,25000],
  [21,33000],[22,41000],[23,50000],[24,62000],[25,75000],
  [26,90000],[27,105000],[28,120000],[29,135000],[30,155000],
];

// Multiplier table [monsters, multiplier]
function getMultiplier(numMonsters: number): number {
  if (numMonsters === 1) return 1;
  if (numMonsters === 2) return 1.5;
  if (numMonsters <= 6) return 2;
  if (numMonsters <= 10) return 2.5;
  if (numMonsters <= 14) return 3;
  return 4;
}

const DIFFICULTY = ['Easy', 'Medium', 'Hard', 'Deadly'];

export default function EncounterDifficulty() {
  const [partySize, setPartySize] = useState(4);
  const [partyLevel, setPartyLevel] = useState(5);
  const [monsters, setMonsters] = useState([{ cr: '5', count: 1 }]);

  function addMonster() { setMonsters(m => [...m, { cr: '1', count: 1 }]); }
  function removeMonster(i: number) { setMonsters(m => m.filter((_, idx) => idx !== i)); }
  function updateMonster(i: number, key: 'cr' | 'count', val: string | number) {
    setMonsters(m => m.map((e, idx) => idx === i ? { ...e, [key]: val } : e));
  }

  const thresholds = XP_THRESHOLDS[partyLevel] || XP_THRESHOLDS[5];
  const partyThresholds = thresholds.map(t => t * partySize);

  let totalMonsterXp = 0;
  let totalMonsterCount = 0;
  for (const m of monsters) {
    const entry = CR_XP.find(([cr]) => String(cr) === m.cr);
    if (entry) {
      totalMonsterXp += entry[1] * m.count;
      totalMonsterCount += m.count;
    }
  }
  const multiplier = getMultiplier(totalMonsterCount);
  const adjustedXp = Math.round(totalMonsterXp * multiplier);

  let diffIndex = -1;
  if (adjustedXp >= partyThresholds[3]) diffIndex = 3;
  else if (adjustedXp >= partyThresholds[2]) diffIndex = 2;
  else if (adjustedXp >= partyThresholds[1]) diffIndex = 1;
  else if (adjustedXp >= partyThresholds[0]) diffIndex = 0;

  const diffClass = [styles.diffEasy, styles.diffMedium, styles.diffHard, styles.diffDeadly];

  return (
    <ConverterShell title="Encounter Difficulty" description="Calculate D&D 5e encounter difficulty rating for your party vs. monsters." category="dnd">
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Party Size</label>
            <input type="number" min={1} max={12} value={partySize} onChange={e => setPartySize(Number(e.target.value))} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Party Level</label>
            <input type="number" min={1} max={20} value={partyLevel} onChange={e => setPartyLevel(Math.max(1, Math.min(20, Number(e.target.value))))} />
          </div>
        </div>

        <div>
          <label>Monsters</label>
          {monsters.map((m, i) => (
            <div key={i} className={styles.row} style={{ marginTop: '0.4rem', alignItems: 'center' }}>
              <div className={styles.field} style={{ flex: 2 }}>
                <select value={m.cr} onChange={e => updateMonster(i, 'cr', e.target.value)}>
                  {CR_XP.map(([cr, xp]) => <option key={cr} value={String(cr)}>CR {cr} ({xp} XP)</option>)}
                </select>
              </div>
              <div className={styles.field} style={{ flex: 1, minWidth: 70 }}>
                <input type="number" min={1} max={50} placeholder="Count" value={m.count}
                  onChange={e => updateMonster(i, 'count', Number(e.target.value))} />
              </div>
              <button className={styles.removeBtn} onClick={() => removeMonster(i)}>✕</button>
            </div>
          ))}
          <button style={{ marginTop: '0.5rem', fontSize: '0.8rem' }} onClick={addMonster}>+ Add Monster</button>
        </div>

        {totalMonsterXp > 0 && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {diffIndex >= 0 ? (
              <span className={`${styles.difficultyBadge} ${diffClass[diffIndex]}`}>
                {DIFFICULTY[diffIndex]}
              </span>
            ) : (
              <span className={`${styles.difficultyBadge} ${styles.diffEasy}`}>Trivial</span>
            )}
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div>Monster XP: {totalMonsterXp.toLocaleString()} × {multiplier} = <strong>{adjustedXp.toLocaleString()}</strong> adjusted</div>
              <div>Thresholds: Easy {partyThresholds[0].toLocaleString()} / Medium {partyThresholds[1].toLocaleString()} / Hard {partyThresholds[2].toLocaleString()} / Deadly {partyThresholds[3].toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
