import { useState, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function ImageCrop() {
  const [src, setSrc] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [w, setW] = useState(200);
  const [h, setH] = useState(200);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setImgSize({ w: img.width, h: img.height });
      setW(Math.min(200, img.width));
      setH(Math.min(200, img.height));
    };
    img.src = url;
    setSrc(url);
  }

  function crop() {
    const canvas = canvasRef.current;
    if (!canvas || !src) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = w; canvas.height = h;
    const img = new Image();
    img.onload = () => { ctx.drawImage(img, x, y, w, h, 0, 0, w, h); };
    img.src = src;
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a'); a.href = canvas.toDataURL(); a.download = 'cropped.png'; a.click();
  }

  return (
    <ConverterShell title="Image Crop" description="Crop an image to specific dimensions." category="image">
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Upload image</label>
          <input type="file" accept="image/*" onChange={onFile} />
        </div>
        {src && imgSize.w > 0 && (
          <>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {[['X', x, setX, imgSize.w], ['Y', y, setY, imgSize.h], ['Width', w, setW, imgSize.w], ['Height', h, setH, imgSize.h]].map(([label, val, setter, max]) => (
                <div key={String(label)} className={styles.field} style={{ flex: 1, minWidth: 80 }}>
                  <label>{label as string}: {val as number}px</label>
                  <input type="range" min={0} max={max as number} value={val as number} onChange={e => (setter as (v: number) => void)(Number(e.target.value))} />
                </div>
              ))}
            </div>
            <div className={styles.actions}><button onClick={crop}>Crop</button></div>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: 8 }} />
            <div className={styles.actions}><button onClick={download}>Download PNG</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
