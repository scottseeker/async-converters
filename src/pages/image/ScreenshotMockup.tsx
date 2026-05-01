import { useState, useRef, useEffect } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function ScreenshotMockup() {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [frame, setFrame] = useState<'browser' | 'dark-browser' | 'phone'>('browser');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setImgSrc(ev.target?.result as string);
    reader.readAsDataURL(f);
  }

  useEffect(() => {
    if (!imgSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      const PAD = frame === 'phone' ? 24 : 32;
      const TOP = frame === 'phone' ? 60 : 36;
      const W = img.width + PAD * 2;
      const H = img.height + TOP + PAD;
      canvas.width = W; canvas.height = H;
      // Frame background
      const isDark = frame === 'dark-browser' || frame === 'phone';
      ctx.fillStyle = isDark ? '#1e1e2e' : '#e8eaed';
      roundRect(ctx, 0, 0, W, H, 14);
      ctx.fill();
      // Top bar
      ctx.fillStyle = isDark ? '#313244' : '#d1d5db';
      roundRect(ctx, 0, 0, W, TOP, 14);
      ctx.fill();
      // Dots
      [[16, TOP/2, '#f38ba8'], [30, TOP/2, '#a6e3a1'], [44, TOP/2, '#f9e2af']].forEach(([x, y, c]) => {
        ctx.beginPath(); ctx.arc(x as number, y as number, 5, 0, Math.PI * 2);
        ctx.fillStyle = c as string; ctx.fill();
      });
      if (frame !== 'phone') {
        ctx.fillStyle = isDark ? '#585b70' : '#9ca3af';
        ctx.fillRect(60, TOP / 2 - 8, W - 80, 16);
        ctx.fillStyle = isDark ? '#cdd6f4' : '#374151';
        ctx.font = '11px sans-serif'; ctx.textBaseline = 'middle';
        ctx.fillText('https://yourwebsite.com', 68, TOP / 2);
      }
      ctx.drawImage(img, PAD, TOP);
    };
    img.src = imgSrc;
  }, [imgSrc, frame]);

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }

  function download() {
    const a = document.createElement('a'); a.href = canvasRef.current!.toDataURL(); a.download = 'mockup.png'; a.click();
  }

  return (
    <ConverterShell title="Screenshot Mockup" description="Wrap a screenshot in a browser or phone frame." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload Screenshot</label><input type="file" accept="image/*" onChange={onFile} /></div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['browser','dark-browser','phone'] as const).map(f => (
            <button key={f} style={frame === f ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setFrame(f)}>{f}</button>
          ))}
        </div>
        {imgSrc && (
          <>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', borderRadius: 12, border: '1px solid var(--border)' }} />
            <div className={styles.actions}><button onClick={download}>Download Mockup</button></div>
          </>
        )}
        {!imgSrc && <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Upload an image to preview it in a frame.</p>}
      </div>
    </ConverterShell>
  );
}
