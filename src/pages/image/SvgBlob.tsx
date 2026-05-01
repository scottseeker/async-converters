import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

function genBlob(cx: number, cy: number, r: number, complexity: number, seed: number): string {
  const points: { x: number; y: number }[] = [];
  const count = 8 + Math.floor(complexity * 6);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI;
    const variance = 0.3 + (Math.sin(seed + i * 7.3) * 0.5 + 0.5) * 0.5;
    const rad = r * (0.7 + variance * 0.5);
    points.push({ x: cx + Math.cos(angle) * rad, y: cy + Math.sin(angle) * rad });
  }
  const path = points.map((p, i) => {
    const prev = points[(i - 1 + count) % count];
    const next = points[(i + 1) % count];
    const cpx = p.x + (next.x - prev.x) * 0.2;
    const cpy = p.y + (next.y - prev.y) * 0.2;
    return `${i === 0 ? 'M' : 'S'} ${cpx} ${cpy} ${p.x} ${p.y}`;
  }).join(' ') + ' Z';
  return path;
}

export default function SvgBlob() {
  const [color, setColor] = useState('#6366f1');
  const [complexity, setComplexity] = useState(0.5);
  const [seed, setSeed] = useState(42);

  const path = genBlob(200, 200, 160, complexity, seed);
  const svg = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <path d="${path}" fill="${color}" />
</svg>`;

  function download() {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'blob.svg'; a.click();
  }

  return (
    <ConverterShell title="SVG Blob Generator" description="Generate organic blob shapes as SVG for backgrounds and decoration." category="image">
      <div className={styles.form}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg viewBox="0 0 400 400" style={{ width: 280, height: 280 }}>
            <path d={path} fill={color} />
          </svg>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}><label>Color</label><input type="color" value={color} onChange={e => setColor(e.target.value)} /></div>
          <div className={styles.field} style={{ flex: 2, minWidth: 120 }}><label>Complexity: {complexity.toFixed(1)}</label><input type="range" min={0} max={1} step={0.05} value={complexity} onChange={e => setComplexity(Number(e.target.value))} /></div>
        </div>
        <div className={styles.actions}>
          <button onClick={() => setSeed(Math.random() * 100)}>🎲 Randomize</button>
          <button onClick={download}>Download SVG</button>
          <button onClick={() => navigator.clipboard.writeText(svg)}>Copy SVG</button>
        </div>
      </div>
    </ConverterShell>
  );
}
