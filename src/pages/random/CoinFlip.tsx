import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './random.module.css';

export default function CoinFlip() {
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [counts, setCounts] = useState({ heads: 0, tails: 0 });

  function flip() {
    setFlipping(true);
    setTimeout(() => {
      const r = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(r);
      setCounts(c => ({ ...c, [r]: c[r] + 1 }));
      setFlipping(false);
    }, 400);
  }

  return (
    <ConverterShell title="Coin Flip" description="Flip a virtual coin and track your heads/tails streak." category="random">
      <div className={styles.form} style={{ alignItems: 'center' }}>
        <div
          onClick={flip}
          style={{
            width: 140, height: 140, borderRadius: '50%',
            background: result === 'tails' ? 'linear-gradient(135deg,#bbb,#888)' : 'linear-gradient(135deg,#f1c40f,#e67e22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem', cursor: 'pointer', transition: 'transform 0.2s',
            transform: flipping ? 'rotateY(90deg)' : 'rotateY(0)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)', userSelect: 'none'
          }}
        >
          {flipping ? '' : result === 'tails' ? '🦅' : '👑'}
        </div>
        <div style={{ textAlign: 'center' }}>
          {result && !flipping && <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'capitalize', marginBottom: '0.5rem' }}>{result}!</div>}
          <button onClick={flip} disabled={flipping} style={{ marginBottom: '1rem' }}>Flip Coin</button>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.875rem' }}>Heads: <strong>{counts.heads}</strong></span>
            <span style={{ fontSize: '0.875rem' }}>Tails: <strong>{counts.tails}</strong></span>
          </div>
          <button onClick={() => { setCounts({ heads: 0, tails: 0 }); setResult(null); }} style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>Reset stats</button>
        </div>
      </div>
    </ConverterShell>
  );
}
