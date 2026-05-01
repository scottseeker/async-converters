import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

type PatternType = 'dots' | 'lines' | 'grid' | 'diagonal' | 'checkers' | 'hexagons';

function generatePattern(type: PatternType, color: string, bg: string, size: number): string {
  const s = size;
  const c = color;
  switch (type) {
    case 'dots':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><circle cx="${s/2}" cy="${s/2}" r="${s/5}" fill="${c}"/></svg>`;
    case 'lines':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><line x1="0" y1="${s/2}" x2="${s}" y2="${s/2}" stroke="${c}" stroke-width="1.5"/></svg>`;
    case 'grid':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><path d="M ${s} 0 L 0 0 0 ${s}" fill="none" stroke="${c}" stroke-width="1"/></svg>`;
    case 'diagonal':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${s*2}" height="${s*2}"><rect fill="${bg}" width="${s*2}" height="${s*2}"/><line x1="0" y1="0" x2="${s*2}" y2="${s*2}" stroke="${c}" stroke-width="1.5"/></svg>`;
    case 'checkers':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${s*2}" height="${s*2}"><rect fill="${bg}" width="${s*2}" height="${s*2}"/><rect fill="${c}" width="${s}" height="${s}"/><rect x="${s}" y="${s}" fill="${c}" width="${s}" height="${s}"/></svg>`;
    case 'hexagons':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><polygon points="${s/2},2 ${s-2},${s/4} ${s-2},${3*s/4} ${s/2},${s-2} 2,${3*s/4} 2,${s/4}" fill="none" stroke="${c}" stroke-width="1"/></svg>`;
  }
}

export default function BgPattern() {
  const [type, setType] = useState<PatternType>('dots');
  const [color, setColor] = useState('#6366f1');
  const [bg, setBg] = useState('#f1f5f9');
  const [size, setSize] = useState(30);

  const svgContent = generatePattern(type, color, bg, size);
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgContent)}`;
  const css = `background-image: url("${dataUrl}");`;

  function download() {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'pattern.svg'; a.click();
  }

  return (
    <ConverterShell title="Background Pattern" description="Generate tileable SVG background patterns with custom colors." category="image">
      <div className={styles.form}>
        <div style={{ height: 180, borderRadius: 12, backgroundImage: `url("${dataUrl}")` }} />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['dots','lines','grid','diagonal','checkers','hexagons'] as PatternType[]).map(p => (
            <button key={p} style={type === p ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setType(p)}>{p}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}><label>Pattern color</label><input type="color" value={color} onChange={e => setColor(e.target.value)} /></div>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}><label>Background</label><input type="color" value={bg} onChange={e => setBg(e.target.value)} /></div>
          <div className={styles.field} style={{ flex: 2, minWidth: 120 }}><label>Tile size: {size}px</label><input type="range" min={10} max={100} value={size} onChange={e => setSize(Number(e.target.value))} /></div>
        </div>
        <div className={styles.actions}>
          <button onClick={() => navigator.clipboard.writeText(css)}>Copy CSS</button>
          <button onClick={download}>Download SVG</button>
        </div>
      </div>
    </ConverterShell>
  );
}
