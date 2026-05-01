import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './gaming.module.css';

// Beacon requirements: layers 1-4, mineral blocks needed
const TIERS = [
  { layer: 1, blocks: 9, effects: ['Speed I', 'Haste I'] },
  { layer: 2, blocks: 34, effects: ['Speed I', 'Haste I', 'Resistance I', 'Jump Boost I'] },
  { layer: 3, blocks: 83, effects: ['Speed I', 'Haste I', 'Resistance I', 'Jump Boost I', 'Strength I'] },
  { layer: 4, blocks: 164, effects: ['Speed II', 'Haste II', 'Resistance II', 'Jump Boost II', 'Strength II', 'Regeneration'] },
];

export default function MinecraftBeacon() {
  const [tier, setTier] = useState(0);
  const [material, setMaterial] = useState('Iron');

  const t = TIERS[tier];

  return (
    <ConverterShell title="Minecraft Beacon Calculator" description="See how many mineral blocks you need for each beacon tier and its effects." category="gaming">
      <div className={styles.form}>
        <div className={styles.actions}>
          {TIERS.map((_, i) => (
            <button key={i} style={tier === i ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setTier(i)}>Tier {i + 1}</button>
          ))}
        </div>
        <div className={styles.field} style={{ maxWidth: 200 }}>
          <label>Mineral</label>
          <select value={material} onChange={e => setMaterial(e.target.value)} style={{ width: '100%' }}>
            {['Iron','Gold','Diamond','Netherite','Emerald'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}><div className={styles.statNum}>{t.blocks}</div><div className={styles.statLabel}>{material} blocks needed</div></div>
          <div className={styles.stat}><div className={styles.statNum}>{t.blocks * 9}</div><div className={styles.statLabel}>{material} ingots total</div></div>
        </div>
        <div>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Unlocked effects:</p>
          {t.effects.map(e => (
            <div key={e} style={{ padding: '0.3rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>✓ {e}</div>
          ))}
        </div>
      </div>
    </ConverterShell>
  );
}
