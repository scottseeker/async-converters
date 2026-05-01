import { useState, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function ImageBlur() {
  const [src, setSrc] = useState('');
  const [radius, setRadius] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setSrc(URL.createObjectURL(f));
  }

  function apply() {
    const canvas = canvasRef.current; if (!canvas || !src) return;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      ctx.filter = `blur(${radius}px)`;
      ctx.drawImage(img, 0, 0);
      ctx.filter = 'none';
    };
    img.src = src;
  }

  return (
    <ConverterShell title="Image Blur" description="Apply a Gaussian blur filter to any image." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload image</label><input type="file" accept="image/*" onChange={onFile} /></div>
        {src && (
          <>
            <div className={styles.field} style={{ maxWidth: 260 }}><label>Blur radius: {radius}px</label><input type="range" min={1} max={50} value={radius} onChange={e => setRadius(Number(e.target.value))} /></div>
            <div className={styles.actions}><button onClick={apply}>Apply Blur</button></div>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: 8 }} />
            <div className={styles.actions}><button onClick={() => { const a = document.createElement('a'); a.href = canvasRef.current?.toDataURL() || ''; a.download = 'blurred.png'; a.click(); }}>Download</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
