import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function CssBoxShadow() {
  const [offsetX, setOffsetX] = useState(4);
  const [offsetY, setOffsetY] = useState(4);
  const [blur, setBlur] = useState(10);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState('#00000066');
  const [inset, setInset] = useState(false);
  const [layers, setLayers] = useState<string[]>([]);

  const shadow = `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`;
  const allShadows = [...layers, shadow].join(', ');
  const css = `box-shadow: ${allShadows};`;

  return (
    <ConverterShell title="CSS Box Shadow" description="Build complex box-shadow CSS values visually." category="image">
      <div className={styles.form}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ width: 150, height: 150, background: 'var(--accent)', borderRadius: 12, boxShadow: allShadows, transition: 'box-shadow 0.2s' }} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[['X offset', offsetX, setOffsetX, -50, 50], ['Y offset', offsetY, setOffsetY, -50, 50], ['Blur', blur, setBlur, 0, 100], ['Spread', spread, setSpread, -50, 50]].map(([label, val, setter, min, max]) => (
            <div key={String(label)} className={styles.field} style={{ flex: 1, minWidth: 100 }}>
              <label>{label as string}: {val as number}px</label>
              <input type="range" min={min as number} max={max as number} value={val as number} onChange={e => (setter as (v: number) => void)(Number(e.target.value))} />
            </div>
          ))}
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}><label>Color</label><input type="color" value={color.slice(0, 7)} onChange={e => setColor(e.target.value + '99')} /></div>
        </div>
        <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={inset} onChange={e => setInset(e.target.checked)} /> Inset
        </label>
        <div className={styles.actions}>
          <button onClick={() => setLayers(l => [...l, shadow])}>+ Add layer</button>
          {layers.length > 0 && <button onClick={() => setLayers(l => l.slice(0, -1))}>− Remove layer</button>}
        </div>
        <div className={styles.field}>
          <label>CSS</label>
          <textarea className={styles.outputArea} readOnly value={css} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', minHeight: 60 }} />
        </div>
        <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(css)}>Copy CSS</button></div>
      </div>
    </ConverterShell>
  );
}
