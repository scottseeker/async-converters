import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './gaming.module.css';

export default function FovCalculator() {
  const [hFov, setHFov] = useState('');
  const [ratio, setRatio] = useState('16:9');
  const [mode, setMode] = useState<'h-to-v' | 'v-to-h'>('h-to-v');

  const parts = ratio.split(':').map(Number);
  const ar = parts[0] && parts[1] ? parts[0] / parts[1] : 16 / 9;
  const h = parseFloat(hFov) * (Math.PI / 180);

  let vFov: number | null = null;
  if (!isNaN(h) && h > 0) {
    if (mode === 'h-to-v') {
      vFov = 2 * Math.atan(Math.tan(h / 2) / ar) * (180 / Math.PI);
    } else {
      vFov = 2 * Math.atan(Math.tan(h / 2) * ar) * (180 / Math.PI);
    }
  }

  return (
    <ConverterShell title="FOV Calculator" description="Convert horizontal to vertical FOV (or vice versa) for any aspect ratio." category="gaming">
      <div className={styles.form}>
        <div className={styles.actions}>
          <button style={mode === 'h-to-v' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode('h-to-v')}>Horizontal → Vertical</button>
          <button style={mode === 'v-to-h' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode('v-to-h')}>Vertical → Horizontal</button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="fov-in">{mode === 'h-to-v' ? 'Horizontal' : 'Vertical'} FOV (°)</label>
            <input id="fov-in" type="number" min="1" max="180" step="1" placeholder="90" value={hFov} onChange={e => setHFov(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="fov-ratio">Aspect Ratio</label>
            <select id="fov-ratio" value={ratio} onChange={e => setRatio(e.target.value)} style={{ width: '100%' }}>
              {['16:9','16:10','21:9','4:3','1:1'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        {vFov !== null && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>{vFov.toFixed(1)}°</div><div className={styles.statLabel}>{mode === 'h-to-v' ? 'Vertical' : 'Horizontal'} FOV</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
