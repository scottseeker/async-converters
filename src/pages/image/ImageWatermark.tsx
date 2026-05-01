import { useState, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function ImageWatermark() {
  const [src, setSrc] = useState('');
  const [text, setText] = useState('© My Brand');
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'>('bottom-right');
  const [opacity, setOpacity] = useState(0.6);
  const [fontSize, setFontSize] = useState(24);
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
      canvas.width = img.width; canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.font = `bold ${fontSize}px sans-serif`;
      const pad = 20;
      const tw = ctx.measureText(text).width;
      let tx = 0, ty = 0;
      if (position === 'bottom-right') { tx = img.width - tw - pad; ty = img.height - pad; }
      else if (position === 'bottom-left') { tx = pad; ty = img.height - pad; }
      else if (position === 'top-right') { tx = img.width - tw - pad; ty = fontSize + pad; }
      else if (position === 'top-left') { tx = pad; ty = fontSize + pad; }
      else { tx = (img.width - tw) / 2; ty = img.height / 2; }
      ctx.fillText(text, tx, ty);
      ctx.globalAlpha = 1;
    };
    img.src = src;
  }

  return (
    <ConverterShell title="Image Watermark" description="Add a text watermark to any image." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload image</label><input type="file" accept="image/*" onChange={onFile} /></div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 2, minWidth: 150 }}><label>Watermark text</label><input type="text" value={text} onChange={e => setText(e.target.value)} /></div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Position</label>
            <select value={position} onChange={e => setPosition(e.target.value as never)}>
              {['bottom-right','bottom-left','top-right','top-left','center'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}><label>Color</label><input type="color" value={color} onChange={e => setColor(e.target.value)} /></div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}><label>Font size: {fontSize}</label><input type="range" min={10} max={120} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} /></div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}><label>Opacity: {opacity.toFixed(1)}</label><input type="range" min={0.1} max={1} step={0.1} value={opacity} onChange={e => setOpacity(Number(e.target.value))} /></div>
        </div>
        <div className={styles.actions}><button onClick={apply} disabled={!src}>Apply Watermark</button></div>
        <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: 8 }} />
        {src && <div className={styles.actions}><button onClick={() => { const a = document.createElement('a'); a.href = canvasRef.current?.toDataURL() || ''; a.download = 'watermarked.png'; a.click(); }}>Download</button></div>}
      </div>
    </ConverterShell>
  );
}
