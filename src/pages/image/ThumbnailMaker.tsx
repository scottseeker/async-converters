import { useState, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function ThumbnailMaker() {
  const [src, setSrc] = useState('');
  const [width, setWidth] = useState(320);
  const [height, setHeight] = useState(180);
  const [fit, setFit] = useState<'contain' | 'cover'>('cover');
  const [bg, setBg] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setSrc(URL.createObjectURL(f));
  }

  function make() {
    const canvas = canvasRef.current; if (!canvas || !src) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = width; canvas.height = height;
    const img = new Image();
    img.onload = () => {
      if (fit === 'cover') {
        ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height);
        const scale = Math.max(width / img.width, height / img.height);
        const sw = img.width * scale, sh = img.height * scale;
        ctx.drawImage(img, (width - sw) / 2, (height - sh) / 2, sw, sh);
      } else {
        ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height);
        const scale = Math.min(width / img.width, height / img.height);
        const sw = img.width * scale, sh = img.height * scale;
        ctx.drawImage(img, (width - sw) / 2, (height - sh) / 2, sw, sh);
      }
    };
    img.src = src;
  }

  return (
    <ConverterShell title="Thumbnail Maker" description="Resize any image to exact thumbnail dimensions." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload image</label><input type="file" accept="image/*" onChange={onFile} /></div>
        {src && (
          <>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className={styles.field} style={{ flex: 1, minWidth: 80 }}><label>Width (px)</label><input type="number" min={1} value={width} onChange={e => setWidth(Number(e.target.value))} /></div>
              <div className={styles.field} style={{ flex: 1, minWidth: 80 }}><label>Height (px)</label><input type="number" min={1} value={height} onChange={e => setHeight(Number(e.target.value))} /></div>
              <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
                <label>Fit</label>
                <select value={fit} onChange={e => setFit(e.target.value as never)}>
                  <option value="cover">Cover (crop)</option>
                  <option value="contain">Contain (letterbox)</option>
                </select>
              </div>
              <div className={styles.field} style={{ flex: 1, minWidth: 80 }}><label>BG color</label><input type="color" value={bg} onChange={e => setBg(e.target.value)} /></div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[['YouTube', 1280, 720], ['Twitter', 1200, 675], ['Facebook', 1200, 630], ['Square', 400, 400]].map(([label, w, h]) => (
                <button key={String(label)} onClick={() => { setWidth(w as number); setHeight(h as number); }}>{label}</button>
              ))}
            </div>
            <div className={styles.actions}><button onClick={make}>Make Thumbnail</button></div>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: 8 }} />
            <div className={styles.actions}><button onClick={() => { const a = document.createElement('a'); a.href = canvasRef.current?.toDataURL() || ''; a.download = `thumbnail-${width}x${height}.png`; a.click(); }}>Download</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
