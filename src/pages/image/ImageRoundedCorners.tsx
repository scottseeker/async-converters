import { useState, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function ImageRoundedCorners() {
  const [src, setSrc] = useState('');
  const [radius, setRadius] = useState(30);
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
      const r = Math.min(radius, img.width / 2, img.height / 2);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(img.width - r, 0);
      ctx.quadraticCurveTo(img.width, 0, img.width, r);
      ctx.lineTo(img.width, img.height - r);
      ctx.quadraticCurveTo(img.width, img.height, img.width - r, img.height);
      ctx.lineTo(r, img.height);
      ctx.quadraticCurveTo(0, img.height, 0, img.height - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0);
    };
    img.src = src;
  }

  return (
    <ConverterShell title="Rounded Corners" description="Add rounded corners to any image with transparent background." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload image</label><input type="file" accept="image/*" onChange={onFile} /></div>
        {src && (
          <>
            <div className={styles.field} style={{ maxWidth: 260 }}><label>Corner radius: {radius}px</label><input type="range" min={0} max={500} value={radius} onChange={e => setRadius(Number(e.target.value))} /></div>
            <div className={styles.actions}><button onClick={apply}>Apply</button></div>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', borderRadius: radius, border: '1px solid var(--border)' }} />
            <div className={styles.actions}><button onClick={() => { const a = document.createElement('a'); a.href = canvasRef.current?.toDataURL('image/png') || ''; a.download = 'rounded.png'; a.click(); }}>Download PNG</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
