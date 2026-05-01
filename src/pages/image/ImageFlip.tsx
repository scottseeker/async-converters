import { useState, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function ImageFlip() {
  const [src, setSrc] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setSrc(URL.createObjectURL(f));
  }

  function transform(flipH: boolean, flipV: boolean, rot: number) {
    const canvas = canvasRef.current;
    if (!canvas || !src) return;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      const swap = rot === 90 || rot === 270;
      canvas.width = swap ? img.height : img.width;
      canvas.height = swap ? img.width : img.height;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    };
    img.src = src;
  }

  function download() {
    const a = document.createElement('a');
    a.href = canvasRef.current?.toDataURL() || '';
    a.download = 'flipped.png'; a.click();
  }

  return (
    <ConverterShell title="Image Flip & Rotate" description="Flip or rotate an image horizontally, vertically, or by 90°." category="image">
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Upload image</label>
          <input type="file" accept="image/*" onChange={onFile} />
        </div>
        {src && (
          <>
            <div className={styles.actions}>
              <button onClick={() => transform(true, false, 0)}>⬅️ Flip H</button>
              <button onClick={() => transform(false, true, 0)}>⬆️ Flip V</button>
              <button onClick={() => transform(false, false, 90)}>↻ Rotate 90°</button>
              <button onClick={() => transform(false, false, 180)}>↻ Rotate 180°</button>
              <button onClick={() => transform(false, false, 270)}>↺ Rotate 270°</button>
            </div>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: 8 }} />
            <div className={styles.actions}><button onClick={download}>Download PNG</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
