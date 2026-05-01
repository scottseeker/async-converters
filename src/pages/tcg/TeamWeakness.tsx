import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './tcg.module.css';

const TYPES = ['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy'];

const CHART: Record<string, { weak: string[]; resist: string[]; immune: string[] }> = {
  Normal:   { weak: ['Fighting'], resist: [], immune: ['Ghost'] },
  Fire:     { weak: ['Water','Ground','Rock'], resist: ['Fire','Grass','Ice','Bug','Steel','Fairy'], immune: [] },
  Water:    { weak: ['Electric','Grass'], resist: ['Fire','Water','Ice','Steel'], immune: [] },
  Electric: { weak: ['Ground'], resist: ['Electric','Flying','Steel'], immune: [] },
  Grass:    { weak: ['Fire','Ice','Poison','Flying','Bug'], resist: ['Water','Electric','Grass','Ground'], immune: [] },
  Ice:      { weak: ['Fire','Fighting','Rock','Steel'], resist: ['Ice'], immune: [] },
  Fighting: { weak: ['Flying','Psychic','Fairy'], resist: ['Rock','Bug','Dark'], immune: [] },
  Poison:   { weak: ['Ground','Psychic'], resist: ['Grass','Fighting','Poison','Bug','Fairy'], immune: [] },
  Ground:   { weak: ['Water','Grass','Ice'], resist: ['Poison','Rock'], immune: ['Electric'] },
  Flying:   { weak: ['Electric','Ice','Rock'], resist: ['Grass','Fighting','Bug'], immune: ['Ground'] },
  Psychic:  { weak: ['Bug','Ghost','Dark'], resist: ['Fighting','Psychic'], immune: [] },
  Bug:      { weak: ['Fire','Flying','Rock'], resist: ['Grass','Fighting','Ground'], immune: [] },
  Rock:     { weak: ['Water','Grass','Fighting','Ground','Steel'], resist: ['Normal','Fire','Poison','Flying'], immune: [] },
  Ghost:    { weak: ['Ghost','Dark'], resist: ['Poison','Bug'], immune: ['Normal','Fighting'] },
  Dragon:   { weak: ['Ice','Dragon','Fairy'], resist: ['Fire','Water','Electric','Grass'], immune: [] },
  Dark:     { weak: ['Fighting','Bug','Fairy'], resist: ['Ghost','Dark'], immune: ['Psychic'] },
  Steel:    { weak: ['Fire','Fighting','Ground'], resist: ['Normal','Grass','Ice','Flying','Psychic','Bug','Rock','Dragon','Steel','Fairy'], immune: ['Poison'] },
  Fairy:    { weak: ['Poison','Steel'], resist: ['Fighting','Bug','Dark'], immune: ['Dragon'] },
};

function getDefenseWeaknesses(type1: string, type2: string) {
  const t = CHART[type1];
  if (!t) return { weak: [], resist: [], immune: [] };
  if (!type2) return t;
  const t2 = CHART[type2];
  if (!t2) return t;
  const immune = [...new Set([...t.immune, ...t2.immune])];
  const weak = [...new Set([...t.weak, ...t2.weak])].filter(x =>
    !immune.includes(x) &&
    !(t2.resist.includes(x) && t.weak.includes(x)) &&
    !(t.resist.includes(x) && t2.weak.includes(x))
  );
  const resist = [...new Set([...t.resist, ...t2.resist])].filter(x => !immune.includes(x) && !weak.includes(x));
  return { weak, resist, immune };
}

const EMPTY = { type1: '', type2: '' };

export default function TeamWeakness() {
  const [slots, setSlots] = useState(Array.from({ length: 6 }, () => ({ ...EMPTY })));

  function setSlot(i: number, key: 'type1' | 'type2', val: string) {
    setSlots(s => s.map((sl, idx) => idx === i ? { ...sl, [key]: val } : sl));
  }

  const activeSlots = slots.filter(s => s.type1);

  // Count how many team members are weak to each attacking type
  const weaknessCounts: Record<string, number> = {};
  const coverageCounts: Record<string, number> = {};

  for (const slot of activeSlots) {
    const { weak, resist, immune } = getDefenseWeaknesses(slot.type1, slot.type2);
    for (const t of weak) weaknessCounts[t] = (weaknessCounts[t] || 0) + 1;
    for (const t of [...resist, ...immune]) coverageCounts[t] = (coverageCounts[t] || 0) + 1;
  }

  const sortedWeak = Object.entries(weaknessCounts).sort((a, b) => b[1] - a[1]);
  const sortedResist = Object.entries(coverageCounts).sort((a, b) => b[1] - a[1]);

  return (
    <ConverterShell title="Team Weakness Analyzer" description="Analyze shared weaknesses and type coverage gaps across your Pokémon team." category="tcg">
      <div className={styles.form}>
        <div className={styles.teamGrid}>
          {slots.map((slot, i) => (
            <div key={i} className={styles.teamSlot}>
              <label>Slot {i + 1} Type 1</label>
              <select value={slot.type1} onChange={e => setSlot(i, 'type1', e.target.value)}>
                <option value="">— empty —</option>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={slot.type2} onChange={e => setSlot(i, 'type2', e.target.value)} disabled={!slot.type1}>
                <option value="">— mono —</option>
                {TYPES.filter(t => t !== slot.type1).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          ))}
        </div>

        {activeSlots.length > 0 && (
          <>
            <div className={styles.row}>
              <div style={{ flex: 1 }}>
                <div className={styles.cardLabel} style={{ color: '#e55', marginBottom: '0.5rem' }}>Team Weaknesses</div>
                {sortedWeak.length === 0 ? <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None</div> : (
                  <table className={styles.weaknessTable}>
                    <thead><tr><th>Attacking Type</th><th>Members Weak</th></tr></thead>
                    <tbody>
                      {sortedWeak.map(([type, count]) => (
                        <tr key={type}>
                          <td>{type}</td>
                          <td><span className={styles.badgeWeak}>{count} / {activeSlots.length}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div className={styles.cardLabel} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Type Coverage (Resists/Immune)</div>
                {sortedResist.length === 0 ? <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None</div> : (
                  <table className={styles.weaknessTable}>
                    <thead><tr><th>Attacking Type</th><th>Members Covered</th></tr></thead>
                    <tbody>
                      {sortedResist.map(([type, count]) => (
                        <tr key={type}>
                          <td>{type}</td>
                          <td><span className={styles.badgeResist}>{count} / {activeSlots.length}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            {sortedWeak.filter(([, c]) => c >= Math.ceil(activeSlots.length / 2)).length > 0 && (
              <div style={{ fontSize: '0.8rem', color: '#e55', padding: '0.5rem 0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid #e55' }}>
                ⚠ Shared weakness: {sortedWeak.filter(([, c]) => c >= Math.ceil(activeSlots.length / 2)).map(([t]) => t).join(', ')} hits half or more of your team.
              </div>
            )}
          </>
        )}
      </div>
    </ConverterShell>
  );
}
