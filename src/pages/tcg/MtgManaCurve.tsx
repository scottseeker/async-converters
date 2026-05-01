import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './tcg.module.css';

const MTG_COLORS = ['White', 'Blue', 'Black', 'Red', 'Green', 'Colorless'] as const;
type MtgColor = typeof MTG_COLORS[number];

const COLOR_HEX: Record<MtgColor, string> = {
  White: '#f0e6c0', Blue: '#4a90d9', Black: '#6c5ce7',
  Red: '#e17055', Green: '#00b894', Colorless: '#b2bec3',
};

interface ManaCost {
  cmc: number;
  count: number;
}

export default function MtgManaCurve() {
  const [deckSize, setDeckSize] = useState(60);
  const [landCount, setLandCount] = useState(24);
  const [manaCosts, setManaCosts] = useState<ManaCost[]>(
    [0, 1, 2, 3, 4, 5, 6].map(cmc => ({ cmc, count: 0 }))
  );
  const [colors, setColors] = useState<MtgColor[]>(['Blue', 'Black']);

  function updateCount(cmc: number, count: number) {
    setManaCosts(m => m.map(e => e.cmc === cmc ? { ...e, count: Math.max(0, count) } : e));
  }

  function toggleColor(c: MtgColor) {
    setColors(cs => cs.includes(c) ? cs.filter(x => x !== c) : [...cs, c]);
  }

  const totalSpells = manaCosts.reduce((a, e) => a + e.count, 0);
  const weightedSum = manaCosts.reduce((a, e) => a + e.cmc * e.count, 0);
  const avgCmc = totalSpells > 0 ? weightedSum / totalSpells : 0;

  // Frank Karsten's formula: lands needed ≈ (avgCMC / 0.415) clamped to reasonable range
  // Simplified: more aggressive = fewer lands, control = more lands
  const recommendedLands = Math.round(Math.max(14, Math.min(28, avgCmc / 0.415)));
  const landDiff = landCount - recommendedLands;

  const maxCount = Math.max(...manaCosts.map(e => e.count), 1);

  return (
    <ConverterShell
      title="MTG Mana Curve Analyzer"
      description="Visualize your deck's mana curve and get a recommended land count based on average CMC."
      category="tcg"
    >
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Deck size</label>
            <input type="number" min={40} max={250} value={deckSize}
              onChange={e => setDeckSize(Math.max(40, Number(e.target.value)))} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Land count</label>
            <input type="number" min={0} max={deckSize} value={landCount}
              onChange={e => setLandCount(Math.max(0, Math.min(deckSize, Number(e.target.value))))} />
          </div>
        </div>

        {/* Color identity */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.07em', marginBottom: '0.4rem' }}>Color Identity</div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {MTG_COLORS.map(c => (
              <button key={c} onClick={() => toggleColor(c)} style={{
                background: colors.includes(c) ? COLOR_HEX[c] : 'transparent',
                border: `2px solid ${COLOR_HEX[c]}`,
                color: colors.includes(c) ? (c === 'White' || c === 'Colorless' ? '#333' : '#fff') : 'var(--text)',
                borderRadius: 6, padding: '0.2rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600,
              }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Mana cost inputs + bar chart */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>Non-Land Spells by CMC</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {manaCosts.map(e => (
              <div key={e.cmc} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ minWidth: 40, fontSize: '0.85rem', fontWeight: 600 }}>
                  {e.cmc === 0 ? '0' : e.cmc === 6 ? '6+' : e.cmc}
                </span>
                <input type="number" min={0} max={40} value={e.count}
                  onChange={ev => updateCount(e.cmc, Number(ev.target.value))}
                  style={{ width: 60, padding: '0.15rem 0.3rem', fontSize: '0.85rem' }}
                />
                <div style={{
                  height: 20, borderRadius: 3,
                  width: maxCount > 0 ? `${(e.count / maxCount) * 180}px` : 0,
                  background: 'var(--accent)', transition: 'width 0.2s',
                  minWidth: e.count > 0 ? 4 : 0,
                }} />
                {e.count > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.count}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        {totalSpells > 0 && (
          <div className={styles.row}>
            <div style={{ background: 'var(--bg-card)', border: '2px solid var(--accent)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', flex: 1 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.07em' }}>Avg CMC</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent)' }}>{avgCmc.toFixed(2)}</div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: `2px solid ${Math.abs(landDiff) <= 1 ? '#2ecc71' : '#f39c12'}`, borderRadius: 'var(--radius)', padding: '0.75rem 1rem', flex: 1 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.07em' }}>Recommended Lands</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: Math.abs(landDiff) <= 1 ? '#2ecc71' : '#f39c12' }}>{recommendedLands}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {landDiff > 0 ? `+${landDiff} over rec.` : landDiff < 0 ? `${landDiff} under rec.` : 'On target ✓'}
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', flex: 1 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.07em' }}>Total Spells</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text)' }}>{totalSpells}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>of {deckSize - landCount} non-land slots</div>
            </div>
          </div>
        )}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Land recommendation based on Frank Karsten's mana base formula (avg CMC ÷ 0.415).
        </div>
      </div>
    </ConverterShell>
  );
}
