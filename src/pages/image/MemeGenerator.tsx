import { useState, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function MemeGenerator() {
  const [src, setSrc] = useState('');
  const [topText, setTopText] = useState('TOP TEXT');
  const [bottomText, setBottomText] = useState('BOTTOM TEXT');
  const [fontSize, setFontSize] = useState(36);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setSrc(URL.createObjectURL(f));
  }

  function render() {
    const canvas = canvasRef.current; if (!canvas || !src) return;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = fontSize / 8;
      ctx.font = `bold ${fontSize}px Impact, Arial`;
      ctx.textAlign = 'center';
      if (topText) {
        ctx.strokeText(topText.toUpperCase(), img.width / 2, fontSize + 10);
        ctx.fillText(topText.toUpperCase(), img.width / 2, fontSize + 10);
      }
      if (bottomText) {
        ctx.strokeText(bottomText.toUpperCase(), img.width / 2, img.height - 15);
        ctx.fillText(bottomText.toUpperCase(), img.width / 2, img.height - 15);
      }
    };
    img.src = src;
  }

  return (
    <ConverterShell title="Meme Generator" description="Add top and bottom meme text to any image." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload image</label><input type="file" accept="image/*" onChange={onFile} /></div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 150 }}><label>Top text</label><input type="text" value={topText} onChange={e => setTopText(e.target.value)} /></div>
          <div className={styles.field} style={{ flex: 1, minWidth: 150 }}><label>Bottom text</label><input type="text" value={bottomText} onChange={e => setBottomText(e.target.value)} /></div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}><label>Font size: {fontSize}</label><input type="range" min={16} max={100} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} /></div>
        </div>
        <div className={styles.actions}><button onClick={render} disabled={!src}>Generate Meme</button></div>
        <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: 8 }} />
        {src && <div className={styles.actions}><button onClick={() => { const a = document.createElement('a'); a.href = canvasRef.current?.toDataURL() || ''; a.download = 'meme.png'; a.click(); }}>Download</button></div>}
      </div>
    </ConverterShell>
  );
}
