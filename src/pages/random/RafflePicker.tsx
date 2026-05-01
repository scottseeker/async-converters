import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './random.module.css';

export default function RafflePicker() {
  const [input, setInput] = useState('');
  const [count, setCount] = useState(1);
  const [winners, setWinners] = useState<string[]>([]);

  const entries = input.split('\n').map(l => l.trim()).filter(Boolean);

  function pick() {
    if (!entries.length) return;
    const shuffled = [...entries].sort(() => Math.random() - 0.5);
    setWinners(shuffled.slice(0, Math.min(count, entries.length)));
  }

  return (
    <ConverterShell title="Raffle Picker" description="Enter participant names and randomly draw winners for a raffle." category="random">
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Participants (one per line)</label>
          <textarea style={{ minHeight: 140 }} placeholder={'Alice\nBob\nCharlie\nDave\nEve'} value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label>Winners to draw: {count}</label>
            <input type="range" min={1} max={Math.max(1, entries.length)} value={count} onChange={e => setCount(Number(e.target.value))} />
          </div>
          <div className={styles.actions}>
            <button onClick={pick} disabled={entries.length === 0}>🎟 Draw Winners</button>
            <button onClick={() => setWinners([])}>Clear</button>
          </div>
        </div>
        {winners.length > 0 && (
          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>🏆 Winner{winners.length > 1 ? 's' : ''}:</p>
            {winners.map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'var(--accent)', color: '#fff', borderRadius: 8, marginBottom: '0.5rem', fontWeight: 600 }}>
                <span>{i + 1}.</span><span>{w}</span>
              </div>
            ))}
          </div>
        )}
        {entries.length > 0 && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{entries.length} participants entered</div>}
      </div>
    </ConverterShell>
  );
}
