import { useState, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function ImageCollage() {
  const [srcs, setSrcs] = useState<string[]>([]);
  const [cols, setCols] = useState(2);
  const [gap, setGap] = useState(4);
  const [thumbSize, setThumbSize] = useState(200);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setSrcs(files.map(f => URL.createObjectURL(f)));
  }

  async function build() {
    const canvas = canvasRef.current; if (!canvas || !srcs.length) return;
    const ctx = canvas.getContext('2d')!;
    const rows = Math.ceil(srcs.length / cols);
    canvas.width = cols * thumbSize + (cols - 1) * gap;
    canvas.height = rows * thumbSize + (rows - 1) * gap;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    await Promise.all(srcs.map((src, i) => new Promise<void>(res => {
      const img = new Image();
      img.onload = () => {
        const col = i % cols, row = Math.floor(i / cols);
        const dx = col * (thumbSize + gap), dy = row * (thumbSize + gap);
        const scale = Math.min(thumbSize / img.width, thumbSize / img.height);
        const sw = img.width * scale, sh = img.height * scale;
        ctx.drawImage(img, dx + (thumbSize - sw) / 2, dy + (thumbSize - sh) / 2, sw, sh);
        res();
      };
      img.src = src;
    })));
  }

  return (
    <ConverterShell title="Image Collage" description="Arrange multiple images into a grid collage." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload images</label><input type="file" accept="image/*" multiple onChange={onFiles} /></div>
        {srcs.length > 0 && (
          <>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className={styles.field} style={{ flex: 1, minWidth: 100 }}><label>Columns: {cols}</label><input type="range" min={1} max={6} value={cols} onChange={e => setCols(Number(e.target.value))} /></div>
              <div className={styles.field} style={{ flex: 1, minWidth: 100 }}><label>Gap: {gap}px</label><input type="range" min={0} max={20} value={gap} onChange={e => setGap(Number(e.target.value))} /></div>
              <div className={styles.field} style={{ flex: 1, minWidth: 100 }}><label>Thumb: {thumbSize}px</label><input type="range" min={80} max={400} step={10} value={thumbSize} onChange={e => setThumbSize(Number(e.target.value))} /></div>
            </div>
            <div className={styles.actions}><button onClick={build}>Build Collage</button></div>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: 8 }} />
            <div className={styles.actions}><button onClick={() => { const a = document.createElement('a'); a.href = canvasRef.current?.toDataURL() || ''; a.download = 'collage.png'; a.click(); }}>Download</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
