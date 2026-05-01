import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function CssGlassmorphism() {
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.2);
  const [saturation, setSaturation] = useState(180);
  const [border, setBorder] = useState(1);
  const [borderOpacity, setBorderOpacity] = useState(0.3);
  const [radius, setRadius] = useState(16);

  const css = `.glass {
  background: rgba(255, 255, 255, ${opacity});
  backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  border-radius: ${radius}px;
  border: ${border}px solid rgba(255, 255, 255, ${borderOpacity});
}`;

  const previewStyle: React.CSSProperties = {
    background: `rgba(255,255,255,${opacity})`,
    backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    borderRadius: radius,
    border: `${border}px solid rgba(255,255,255,${borderOpacity})`,
    padding: '2rem',
    color: '#fff',
    fontWeight: 700,
    textAlign: 'center',
    fontSize: '1.1rem',
  };

  return (
    <ConverterShell title="CSS Glassmorphism" description="Generate glassmorphism (frosted glass) CSS styles." category="image">
      <div className={styles.form}>
        <div style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899,#f1c40f)', borderRadius: 16, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 160 }}>
          <div style={previewStyle}>✨ Glassmorphism</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[['Blur', blur, setBlur, 0, 50, 1], ['Opacity', opacity, setOpacity, 0, 0.9, 0.05], ['Saturation %', saturation, setSaturation, 100, 300, 10], ['Border px', border, setBorder, 0, 5, 1], ['Border opacity', borderOpacity, setBorderOpacity, 0, 1, 0.05], ['Radius px', radius, setRadius, 0, 48, 2]].map(([label, val, setter, min, max, step]) => (
            <div key={String(label)} className={styles.field} style={{ flex: 1, minWidth: 110 }}>
              <label>{label as string}: {typeof val === 'number' && val < 2 ? (val as number).toFixed(2) : val as number}</label>
              <input type="range" min={min as number} max={max as number} step={step as number} value={val as number} onChange={e => (setter as (v: number) => void)(Number(e.target.value))} />
            </div>
          ))}
        </div>
        <div className={styles.field}>
          <label>CSS</label>
          <textarea className={styles.outputArea} readOnly value={css} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', minHeight: 130 }} />
        </div>
        <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(css)}>Copy CSS</button></div>
      </div>
    </ConverterShell>
  );
}
