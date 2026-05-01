import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './tcg.module.css';

interface Player {
  name: string;
  lives: number;
  hand: number;
  leader: string;
}

const START_LIVES = 5;
const START_HAND = 5;

function makePlayer(name: string, leader = ''): Player {
  return { name, lives: START_LIVES, hand: START_HAND, leader };
}

export default function OpLifeCounter() {
  const [players, setPlayers] = useState<Player[]>([
    makePlayer('Player 1'),
    makePlayer('Player 2'),
  ]);
  const [log, setLog] = useState<string[]>([]);

  function update(idx: number, field: keyof Player, delta: number) {
    setPlayers(ps => ps.map((p, i) => {
      if (i !== idx) return p;
      const newVal = Math.max(0, (p[field] as number) + delta);
      const action = delta > 0
        ? `${p.name} gained ${field === 'lives' ? 'a life' : 'a hand card'} (${newVal})`
        : `${p.name} lost ${field === 'lives' ? 'a life' : 'a hand card'} (${newVal})`;
      setLog(l => [action, ...l.slice(0, 19)]);
      return { ...p, [field]: newVal };
    }));
  }

  function setLeader(idx: number, val: string) {
    setPlayers(ps => ps.map((p, i) => i === idx ? { ...p, leader: val } : p));
  }

  function setName(idx: number, val: string) {
    setPlayers(ps => ps.map((p, i) => i === idx ? { ...p, name: val } : p));
  }

  function reset() {
    setPlayers(ps => ps.map(p => ({ ...p, lives: START_LIVES, hand: START_HAND })));
    setLog([]);
  }

  return (
    <ConverterShell
      title="One Piece Life Counter"
      description="Track life cards and hand size for both players in a One Piece Card Game match."
      category="tcg"
    >
      <div className={styles.form}>
        <div className={styles.row}>
          {players.map((p, idx) => (
            <div key={idx} style={{
              flex: 1, minWidth: 200, background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
            }}>
              <input
                value={p.name}
                onChange={e => setName(idx, e.target.value)}
                style={{ fontWeight: 700, fontSize: '1rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.2rem 0', color: 'var(--text)' }}
              />
              <input
                value={p.leader}
                onChange={e => setLeader(idx, e.target.value)}
                placeholder="Leader card (e.g. Luffy OP01-060)"
                style={{ fontSize: '0.75rem', background: 'transparent', border: 'none', borderBottom: '1px dashed var(--border)', padding: '0.15rem 0', color: 'var(--text-muted)' }}
              />

              {/* Lives */}
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.07em', marginBottom: '0.35rem' }}>Life Cards</div>
                <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.4rem' }}>
                  {Array.from({ length: START_LIVES }).map((_, i) => (
                    <div key={i} style={{
                      width: 28, height: 40, borderRadius: 4,
                      background: i < p.lives ? '#e74c3c' : 'var(--bg-code)',
                      border: `2px solid ${i < p.lives ? '#e74c3c' : 'var(--border)'}`,
                      opacity: i < p.lives ? 1 : 0.3,
                    }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button onClick={() => update(idx, 'lives', -1)} disabled={p.lives === 0} style={{ width: 32, height: 32, fontSize: '1.1rem' }}>−</button>
                  <span style={{ fontWeight: 900, fontSize: '1.5rem', color: p.lives === 0 ? '#e74c3c' : 'var(--text)', minWidth: 28, textAlign: 'center' }}>{p.lives}</span>
                  <button onClick={() => update(idx, 'lives', 1)} disabled={p.lives >= START_LIVES} style={{ width: 32, height: 32, fontSize: '1.1rem' }}>+</button>
                  {p.lives === 0 && <span style={{ color: '#e74c3c', fontWeight: 700, fontSize: '0.8rem' }}>💀 KO!</span>}
                </div>
              </div>

              {/* Hand */}
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.07em', marginBottom: '0.35rem' }}>Hand Size</div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button onClick={() => update(idx, 'hand', -1)} disabled={p.hand === 0} style={{ width: 32, height: 32, fontSize: '1.1rem' }}>−</button>
                  <span style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--text)', minWidth: 28, textAlign: 'center' }}>{p.hand}</span>
                  <button onClick={() => update(idx, 'hand', 1)} style={{ width: 32, height: 32, fontSize: '1.1rem' }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button onClick={reset}>Reset Game</button>
        </div>

        {log.length > 0 && (
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.07em', marginBottom: '0.4rem' }}>Game Log</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', maxHeight: 140, overflowY: 'auto' }}>
              {log.map((entry, i) => (
                <div key={i} style={{ fontSize: '0.77rem', color: i === 0 ? 'var(--text)' : 'var(--text-muted)', padding: '0.15rem 0', borderBottom: '1px solid var(--border)' }}>
                  {entry}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
