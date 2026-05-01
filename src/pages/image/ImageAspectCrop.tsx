import { useState, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

const RATIOS: Record<string, [number, number]> = {
  '1:1': [1, 1], '4:3': [4, 3], '16:9': [16, 9], '9:16': [9, 16],
  '3:2': [3, 2], '2:3': [2, 3], '21:9': [21, 9],
};

export default function ImageAspectCrop() {
  const [src, setSrc] = useState('');
  const [ratio, setRatio] = useState('16:9');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setSrc(URL.createObjectURL(f));
  }

  function crop() {
    const canvas = canvasRef.current; if (!canvas || !src) return;
    const [rw, rh] = RATIOS[ratio];
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      let sw = img.width, sh = img.height;
      if (sw / sh > rw / rh) { sw = Math.round(sh * rw / rh); } else { sh = Math.round(sw * rh / rw); }
      const sx = Math.floor((img.width - sw) / 2), sy = Math.floor((img.height - sh) / 2);
      canvas.width = sw; canvas.height = sh;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    };
    img.src = src;
  }

  return (
    <ConverterShell title="Aspect Ratio Crop" description="Crop an image to a specific aspect ratio (center crop)." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload image</label><input type="file" accept="image/*" onChange={onFile} /></div>
        {src && (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {Object.keys(RATIOS).map(r => (
                <button key={r} style={ratio === r ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setRatio(r)}>{r}</button>
              ))}
            </div>
            <div className={styles.actions}><button onClick={crop}>Crop to {ratio}</button></div>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: 8 }} />
            <div className={styles.actions}><button onClick={() => { const a = document.createElement('a'); a.href = canvasRef.current?.toDataURL() || ''; a.download = `crop-${ratio.replace(':','x')}.png`; a.click(); }}>Download</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
