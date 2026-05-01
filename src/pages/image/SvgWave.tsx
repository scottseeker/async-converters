import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function SvgWave() {
  const [amplitude, setAmplitude] = useState(40);
  const [freq, setFreq] = useState(2);
  const [color, setColor] = useState('#6366f1');
  const [opacity] = useState(1);
  const [layers, setLayers] = useState(1);

  function wavePath(amp: number, f: number, yOffset: number, flip = false): string {
    const W = 1440, H = 320;
    const points = [`M 0 ${flip ? 0 : H}`];
    for (let x = 0; x <= W; x += 10) {
      const y = yOffset + Math.sin((x / W) * f * Math.PI * 2) * amp;
      points.push(`L ${x} ${y}`);
    }
    points.push(`L ${W} ${flip ? 0 : H}`, `L 0 ${flip ? 0 : H}`, 'Z');
    return points.join(' ');
  }

  const H = 320;
  const paths = Array.from({ length: layers }, (_, i) => ({
    d: wavePath(amplitude, freq + i * 0.5, H / 2 + i * 20),
    color,
    opacity: opacity - i * 0.15,
  }));

  const svg = `<svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
${paths.map(p => `  <path d="${p.d}" fill="${p.color}" fill-opacity="${p.opacity.toFixed(2)}" />`).join('\n')}
</svg>`;

  function download() {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'wave.svg'; a.click();
  }

  return (
    <ConverterShell title="SVG Wave Generator" description="Generate smooth SVG wave shapes for section dividers." category="image">
      <div className={styles.form}>
        <div style={{ background: '#f1f5f9', borderRadius: 12, overflow: 'hidden' }}>
          <svg viewBox="0 0 1440 320" style={{ width: '100%', display: 'block' }}>
            {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} fillOpacity={p.opacity} />)}
          </svg>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}><label>Amplitude: {amplitude}</label><input type="range" min={5} max={120} value={amplitude} onChange={e => setAmplitude(Number(e.target.value))} /></div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}><label>Frequency: {freq}</label><input type="range" min={1} max={8} value={freq} onChange={e => setFreq(Number(e.target.value))} /></div>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}><label>Color</label><input type="color" value={color} onChange={e => setColor(e.target.value)} /></div>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}><label>Layers: {layers}</label><input type="range" min={1} max={4} value={layers} onChange={e => setLayers(Number(e.target.value))} /></div>
        </div>
        <div className={styles.actions}>
          <button onClick={download}>Download SVG</button>
          <button onClick={() => navigator.clipboard.writeText(svg)}>Copy SVG</button>
        </div>
      </div>
    </ConverterShell>
  );
}
