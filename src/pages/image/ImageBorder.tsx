import { useState, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function ImageBorder() {
  const [src, setSrc] = useState('');
  const [thickness, setThickness] = useState(20);
  const [color, setColor] = useState('#ffffff');
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
      canvas.width = img.width + thickness * 2;
      canvas.height = img.height + thickness * 2;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, thickness, thickness);
    };
    img.src = src;
  }

  return (
    <ConverterShell title="Image Border" description="Add a solid color border around any image." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload image</label><input type="file" accept="image/*" onChange={onFile} /></div>
        {src && (
          <>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className={styles.field} style={{ flex: 2, minWidth: 160 }}><label>Thickness: {thickness}px</label><input type="range" min={1} max={150} value={thickness} onChange={e => setThickness(Number(e.target.value))} /></div>
              <div className={styles.field} style={{ flex: 1, minWidth: 80 }}><label>Color</label><input type="color" value={color} onChange={e => setColor(e.target.value)} /></div>
            </div>
            <div className={styles.actions}><button onClick={apply}>Add Border</button></div>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: 4 }} />
            <div className={styles.actions}><button onClick={() => { const a = document.createElement('a'); a.href = canvasRef.current?.toDataURL() || ''; a.download = 'bordered.png'; a.click(); }}>Download</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
