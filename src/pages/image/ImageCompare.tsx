import { useState, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function ImageCompare() {
  const [img1, setImg1] = useState<string | null>(null);
  const [img2, setImg2] = useState<string | null>(null);
  const [slider, setSlider] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>, set: (s: string) => void) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => set(ev.target?.result as string);
    reader.readAsDataURL(f);
  }

  function onMouseMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSlider(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
  }

  function onTouchMove(e: React.TouchEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touch = e.touches[0];
    setSlider(Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100)));
  }

  const both = img1 && img2;

  return (
    <ConverterShell title="Image Compare" description="Upload two images and compare them side-by-side with a draggable slider." category="image">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className={styles.field} style={{ flex: 1 }}><label>Before image</label><input type="file" accept="image/*" onChange={e => onFile(e, setImg1)} /></div>
          <div className={styles.field} style={{ flex: 1 }}><label>After image</label><input type="file" accept="image/*" onChange={e => onFile(e, setImg2)} /></div>
        </div>
        {!both && <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Upload both images to compare.</p>}
        {both && (
          <div ref={containerRef} style={{ position: 'relative', width: '100%', userSelect: 'none', overflow: 'hidden', borderRadius: 12, cursor: 'col-resize', touchAction: 'none' }}
            onMouseMove={onMouseMove} onTouchMove={onTouchMove}>
            <img src={img1} alt="before" style={{ width: '100%', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', width: `${slider}%` }}>
              <img src={img2} alt="after" style={{ width: `${10000 / slider}%`, maxWidth: 'none', display: 'block' }} />
            </div>
            {/* Divider */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${slider}%`, width: 2, background: '#fff', boxShadow: '0 0 4px rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 32, height: 32, background: '#fff', borderRadius: '50%', boxShadow: '0 2px 6px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#333' }}>⇔</div>
            </div>
            <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '2px 8px', borderRadius: 6, fontSize: 12 }}>Before</div>
            <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '2px 8px', borderRadius: 6, fontSize: 12 }}>After</div>
          </div>
        )}
        {both && (
          <div className={styles.field}>
            <label>Position: {Math.round(slider)}%</label>
            <input type="range" min={0} max={100} value={slider} onChange={e => setSlider(Number(e.target.value))} />
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
