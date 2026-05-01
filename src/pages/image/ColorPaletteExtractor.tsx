import { useState, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function ColorPaletteExtractor() {
  const [src, setSrc] = useState('');
  const [colors, setColors] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    setSrc(url);
    extract(url);
  }

  function extract(url: string) {
    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      const W = 100, H = 100;
      canvas.width = W; canvas.height = H;
      ctx.drawImage(img, 0, 0, W, H);
      const data = ctx.getImageData(0, 0, W, H).data;
      const buckets: Record<string, number> = {};
      for (let i = 0; i < data.length; i += 4) {
        const r = Math.round(data[i] / 16) * 16;
        const g = Math.round(data[i + 1] / 16) * 16;
        const b = Math.round(data[i + 2] / 16) * 16;
        const key = `${r},${g},${b}`;
        buckets[key] = (buckets[key] || 0) + 1;
      }
      const sorted = Object.entries(buckets).sort((a, b) => b[1] - a[1]).slice(0, 8);
      setColors(sorted.map(([k]) => {
        const [r, g, b] = k.split(',').map(Number);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }));
    };
    img.src = url;
  }

  return (
    <ConverterShell title="Color Palette Extractor" description="Extract the dominant colors from any image." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload image</label><input type="file" accept="image/*" onChange={onFile} /></div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {src && <img src={src} alt="preview" style={{ maxWidth: 300, borderRadius: 8 }} />}
        {colors.length > 0 && (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {colors.map(c => (
                <div key={c} onClick={() => navigator.clipboard.writeText(c)} style={{ width: 60, height: 60, background: c, borderRadius: 8, cursor: 'pointer', border: '1px solid var(--border)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 0 4px' }} title={`Copy ${c}`}>
                  <span style={{ fontSize: '0.6rem', color: '#fff', textShadow: '0 1px 3px #000', fontFamily: 'var(--font-mono)' }}>{c}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click a color to copy its hex code</p>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
