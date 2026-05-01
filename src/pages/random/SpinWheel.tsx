import { useState, useRef, useEffect } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './random.module.css';

export default function SpinWheel() {
  const [input, setInput] = useState('Option 1\nOption 2\nOption 3\nOption 4');
  const [result, setResult] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const items = input.split('\n').map(l => l.trim()).filter(Boolean);
  const COLORS = ['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6','#e67e22','#1abc9c','#e91e63'];

  function draw(rotAngle: number) {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, cx = W / 2, cy = W / 2, r = cx - 10;
    ctx.clearRect(0, 0, W, W);
    const arc = (2 * Math.PI) / items.length;
    items.forEach((item, i) => {
      const start = rotAngle + i * arc;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + arc);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px sans-serif';
      const label = item.length > 14 ? item.slice(0, 13) + '…' : item;
      ctx.fillText(label, r - 10, 4);
      ctx.restore();
    });
    // pointer
    ctx.beginPath();
    ctx.moveTo(cx + r + 8, cy);
    ctx.lineTo(cx + r - 8, cy - 10);
    ctx.lineTo(cx + r - 8, cy + 10);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }

  useEffect(() => { draw(angle); }, [items.join(','), angle]);

  function spin() {
    if (spinning || items.length === 0) return;
    setSpinning(true);
    const spins = 4 + Math.random() * 4;
    const extra = Math.random() * Math.PI * 2;
    const target = angle + spins * Math.PI * 2 + extra;
    const duration = 3000;
    const start = performance.now();
    const startAngle = angle;

    function frame(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const cur = startAngle + (target - startAngle) * ease;
      setAngle(cur);
      draw(cur);
      if (t < 1) { requestAnimationFrame(frame); }
      else {
        setAngle(cur);
        const arc = (2 * Math.PI) / items.length;
        const norm = ((cur % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const picked = items[Math.floor((2 * Math.PI - norm) / arc) % items.length] || items[0];
        setResult(picked);
        setSpinning(false);
      }
    }
    requestAnimationFrame(frame);
  }

  return (
    <ConverterShell title="Spin the Wheel" description="Add options and spin the wheel to pick one at random." category="random">
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Options (one per line)</label>
          <textarea style={{ minHeight: 100 }} value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <canvas ref={canvasRef} width={320} height={320} style={{ borderRadius: '50%' }} />
        </div>
        <div className={styles.actions} style={{ justifyContent: 'center' }}>
          <button onClick={spin} disabled={spinning || items.length < 2}>🌀 Spin!</button>
        </div>
        {result && <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)', padding: '1rem' }}>🎯 {result}</div>}
      </div>
    </ConverterShell>
  );
}
