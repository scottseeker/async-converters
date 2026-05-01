import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './random.module.css';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SecretSanta() {
  const [input, setInput] = useState('');
  const [pairs, setPairs] = useState<{ giver: string; receiver: string }[]>([]);
  const [error, setError] = useState('');
  const [reveal, setReveal] = useState<number[]>([]);

  const names = input.split('\n').map(l => l.trim()).filter(Boolean);

  function generate() {
    if (names.length < 2) { setError('Need at least 2 participants.'); return; }
    let givers = [...names], receivers = shuffle([...names]);
    for (let attempt = 0; attempt < 100; attempt++) {
      receivers = shuffle([...names]);
      if (givers.every((g, i) => g !== receivers[i])) break;
    }
    if (givers.some((g, i) => g === receivers[i])) { setError('Could not generate valid assignments. Try again.'); return; }
    setError('');
    setPairs(givers.map((g, i) => ({ giver: g, receiver: receivers[i] })));
    setReveal([]);
  }

  return (
    <ConverterShell title="Secret Santa Generator" description="Assign Secret Santa gift partners — click each card to reveal who you give to." category="random">
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Participants (one per line)</label>
          <textarea style={{ minHeight: 120 }} placeholder={'Alice\nBob\nCharlie\nDave'} value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.actions}>
          <button onClick={generate} disabled={names.length < 2}>🎅 Generate</button>
          <button onClick={() => { setPairs([]); setReveal([]); }}>Clear</button>
        </div>
        {error && <p style={{ color: '#e55' }}>{error}</p>}
        {pairs.length > 0 && (
          <div className={styles.grid}>
            {pairs.map((p, i) => (
              <div key={i} className={styles.card} style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'center' }} onClick={() => setReveal(r => r.includes(i) ? r.filter(x => x !== i) : [...r, i])}>
                <div className={styles.cardLabel}>{p.giver}</div>
                <div style={{ fontSize: '1.5rem', margin: '0.25rem 0' }}>🎁</div>
                {reveal.includes(i)
                  ? <div style={{ color: 'var(--accent)', fontWeight: 600 }}>{p.receiver}</div>
                  : <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Tap to reveal</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
