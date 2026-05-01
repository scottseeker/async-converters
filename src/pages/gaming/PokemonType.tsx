import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './gaming.module.css';

const TYPES = ['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy'];

const CHART: Record<string, { weak: string[]; resist: string[]; immune: string[] }> = {
  Normal: { weak: ['Fighting'], resist: [], immune: ['Ghost'] },
  Fire: { weak: ['Water','Ground','Rock'], resist: ['Fire','Grass','Ice','Bug','Steel','Fairy'], immune: [] },
  Water: { weak: ['Electric','Grass'], resist: ['Fire','Water','Ice','Steel'], immune: [] },
  Electric: { weak: ['Ground'], resist: ['Electric','Flying','Steel'], immune: [] },
  Grass: { weak: ['Fire','Ice','Poison','Flying','Bug'], resist: ['Water','Electric','Grass','Ground'], immune: [] },
  Ice: { weak: ['Fire','Fighting','Rock','Steel'], resist: ['Ice'], immune: [] },
  Fighting: { weak: ['Flying','Psychic','Fairy'], resist: ['Rock','Bug','Dark'], immune: [] },
  Poison: { weak: ['Ground','Psychic'], resist: ['Grass','Fighting','Poison','Bug','Fairy'], immune: [] },
  Ground: { weak: ['Water','Grass','Ice'], resist: ['Poison','Rock'], immune: ['Electric'] },
  Flying: { weak: ['Electric','Ice','Rock'], resist: ['Grass','Fighting','Bug'], immune: ['Ground'] },
  Psychic: { weak: ['Bug','Ghost','Dark'], resist: ['Fighting','Psychic'], immune: [] },
  Bug: { weak: ['Fire','Flying','Rock'], resist: ['Grass','Fighting','Ground'], immune: [] },
  Rock: { weak: ['Water','Grass','Fighting','Ground','Steel'], resist: ['Normal','Fire','Poison','Flying'], immune: [] },
  Ghost: { weak: ['Ghost','Dark'], resist: ['Poison','Bug'], immune: ['Normal','Fighting'] },
  Dragon: { weak: ['Ice','Dragon','Fairy'], resist: ['Fire','Water','Electric','Grass'], immune: [] },
  Dark: { weak: ['Fighting','Bug','Fairy'], resist: ['Ghost','Dark'], immune: ['Psychic'] },
  Steel: { weak: ['Fire','Fighting','Ground'], resist: ['Normal','Grass','Ice','Flying','Psychic','Bug','Rock','Dragon','Steel','Fairy'], immune: ['Poison'] },
  Fairy: { weak: ['Poison','Steel'], resist: ['Fighting','Bug','Dark'], immune: ['Dragon'] },
};

export default function PokemonType() {
  const [type1, setType1] = useState('Normal');
  const [type2, setType2] = useState('');

  function getCombined() {
    const t = CHART[type1];
    if (!t) return { weak: [], resist: [], immune: [] };
    if (!type2 || type2 === type1) return t;
    const t2 = CHART[type2];
    if (!t2) return t;
    const immune = [...new Set([...t.immune, ...t2.immune])];
    const weak = [...new Set([...t.weak, ...t2.weak])].filter(x => !immune.includes(x) && !(t2.resist.includes(x) && t.weak.includes(x)) && !(t.resist.includes(x) && t2.weak.includes(x)));
    const resist = [...new Set([...t.resist, ...t2.resist])].filter(x => !immune.includes(x) && !weak.includes(x));
    return { weak, resist, immune };
  }

  const result = getCombined();

  return (
    <ConverterShell title="Pokémon Type Chart" description="Look up weaknesses, resistances, and immunities for any Pokémon type combination." category="gaming">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label>Type 1</label>
            <select value={type1} onChange={e => setType1(e.target.value)} style={{ width: '100%' }}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label>Type 2 (optional)</label>
            <select value={type2} onChange={e => setType2(e.target.value)} style={{ width: '100%' }}>
              <option value="">— none —</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.grid}>
          <div className={styles.card} style={{ borderColor: '#e55' }}>
            <div className={styles.cardLabel} style={{ color: '#e55' }}>Weak to (×2)</div>
            {result.weak.length > 0 ? result.weak.map(t => <div key={t} className={styles.cardValue}>{t}</div>) : <div className={styles.cardValue}>—</div>}
          </div>
          <div className={styles.card} style={{ borderColor: 'var(--accent)' }}>
            <div className={styles.cardLabel} style={{ color: 'var(--accent)' }}>Resists (×½)</div>
            {result.resist.length > 0 ? result.resist.map(t => <div key={t} className={styles.cardValue}>{t}</div>) : <div className={styles.cardValue}>—</div>}
          </div>
          <div className={styles.card}>
            <div className={styles.cardLabel}>Immune (×0)</div>
            {result.immune.length > 0 ? result.immune.map(t => <div key={t} className={styles.cardValue}>{t}</div>) : <div className={styles.cardValue}>—</div>}
          </div>
        </div>
      </div>
    </ConverterShell>
  );
}
