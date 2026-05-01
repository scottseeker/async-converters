import { useState, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

const SIZES = [16, 32, 48, 64, 128, 180, 192, 256, 512];

export default function FaviconGenerator() {
  const [src, setSrc] = useState('');
  const [size, setSize] = useState(32);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setSrc(URL.createObjectURL(f));
  }

  function generate() {
    const canvas = canvasRef.current; if (!canvas || !src) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = size; canvas.height = size;
    const img = new Image();
    img.onload = () => { ctx.drawImage(img, 0, 0, size, size); };
    img.src = src;
  }

  function downloadIco() {
    const canvas = canvasRef.current; if (!canvas) return;
    canvas.toBlob(blob => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'favicon.png'; // .ico requires special encoding
      a.click();
    }, 'image/png');
  }

  return (
    <ConverterShell title="Favicon Generator" description="Resize an image to favicon sizes (16×16 to 512×512)." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload image</label><input type="file" accept="image/*" onChange={onFile} /></div>
        {src && (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {SIZES.map(s => (
                <button key={s} style={size === s ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setSize(s)}>{s}×{s}</button>
              ))}
            </div>
            <div className={styles.actions}><button onClick={generate}>Generate</button></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <canvas ref={canvasRef} style={{ border: '1px solid var(--border)', imageRendering: 'pixelated' }} />
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{size}×{size}px preview</div>
            </div>
            <div className={styles.actions}><button onClick={downloadIco}>Download PNG</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
