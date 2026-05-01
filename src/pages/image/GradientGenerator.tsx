import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function GradientGenerator() {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState([{ color: '#6366f1', pos: 0 }, { color: '#ec4899', pos: 100 }]);

  function addStop() { setStops(s => [...s, { color: '#f1c40f', pos: 50 }].sort((a, b) => a.pos - b.pos)); }
  function removeStop(i: number) { if (stops.length <= 2) return; setStops(s => s.filter((_, j) => j !== i)); }
  function update(i: number, key: string, val: string | number) { setStops(s => s.map((st, j) => j === i ? { ...st, [key]: val } : st)); }

  const stopsStr = stops.map(s => `${s.color} ${s.pos}%`).join(', ');
  const gradient = type === 'linear' ? `linear-gradient(${angle}deg, ${stopsStr})` : `radial-gradient(circle, ${stopsStr})`;
  const css = `background: ${gradient};`;

  return (
    <ConverterShell title="Gradient Generator" description="Create CSS gradients visually and copy the code." category="image">
      <div className={styles.form}>
        <div style={{ height: 160, borderRadius: 12, background: gradient, transition: 'background 0.3s' }} />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button style={type === 'linear' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setType('linear')}>Linear</button>
          <button style={type === 'radial' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setType('radial')}>Radial</button>
        </div>
        {type === 'linear' && (
          <div className={styles.field} style={{ maxWidth: 300 }}>
            <label>Angle: {angle}°</label>
            <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))} />
          </div>
        )}
        {stops.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input type="color" value={s.color} onChange={e => update(i, 'color', e.target.value)} />
            <input type="range" min={0} max={100} value={s.pos} style={{ flex: 1 }} onChange={e => update(i, 'pos', Number(e.target.value))} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', width: 36 }}>{s.pos}%</span>
            <button onClick={() => removeStop(i)} disabled={stops.length <= 2}>✕</button>
          </div>
        ))}
        <div className={styles.actions}><button onClick={addStop}>+ Add stop</button></div>
        <div className={styles.field}>
          <label>CSS</label>
          <textarea className={styles.outputArea} readOnly value={css} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', minHeight: 60 }} />
        </div>
        <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(css)}>Copy CSS</button></div>
      </div>
    </ConverterShell>
  );
}
