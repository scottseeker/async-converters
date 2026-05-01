import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './tcg.module.css';

// DON!! mechanic: turn 1 you get 2 DON!!, then +2 per turn up to 10 max
// Each DON!! can be attached to characters (rested) or kept active
// Attaching costs 1 DON!! per character (it becomes rested)

function getDon(turn: number) {
  return Math.min(10, turn * 2);
}

export default function OpDonTracker() {
  const [turn, setTurn] = useState(1);
  const [attached, setAttached] = useState<number[]>([]);
  const [label, setLabel] = useState('');
  const [attachCost, setAttachCost] = useState(1);

  const available = getDon(turn);
  const totalAttached = attached.reduce((a, b) => a + b, 0);
  const remaining = available - totalAttached;

  function addAttach() {
    if (attachCost < 1 || totalAttached + attachCost > available) return;
    setAttached(a => [...a, attachCost]);
    setLabel('');
    setAttachCost(1);
  }

  function removeAttach(i: number) {
    setAttached(a => a.filter((_, idx) => idx !== i));
  }

  function nextTurn() {
    setTurn(t => Math.min(10, t + 1));
    // DON!! returns at end of turn — reset attachments
    setAttached([]);
  }

  function reset() {
    setTurn(1);
    setAttached([]);
  }

  return (
    <ConverterShell
      title="One Piece DON!! Tracker"
      description="Track DON!! availability by turn and simulate attachment costs in the One Piece Card Game."
      category="tcg"
    >
      <div className={styles.form}>
        <div className={styles.row} style={{ alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.07em' }}>Turn</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>{turn}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.07em' }}>DON!! Available</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#e74c3c', lineHeight: 1 }}>{available}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.07em' }}>DON!! Remaining</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: remaining >= 0 ? '#2ecc71' : '#e74c3c', lineHeight: 1 }}>{remaining}</div>
          </div>
        </div>

        {/* DON!! pip display */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {Array.from({ length: available }).map((_, i) => (
            <div key={i} style={{
              width: 32, height: 32, borderRadius: '50%', border: '2px solid #e74c3c',
              background: i < totalAttached ? '#e74c3c' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 700, color: i < totalAttached ? '#fff' : '#e74c3c',
            }}>
              {i < totalAttached ? '⚓' : ''}
            </div>
          ))}
          {Array.from({ length: 10 - available }).map((_, i) => (
            <div key={`locked-${i}`} style={{
              width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--border)',
              background: 'var(--bg-code)', opacity: 0.3,
            }} />
          ))}
        </div>

        {/* Attach form */}
        <div className={styles.row} style={{ alignItems: 'flex-end' }}>
          <div className={styles.field} style={{ flex: 2 }}>
            <label>Character / card name (optional)</label>
            <input type="text" placeholder="e.g. Monkey D. Luffy" value={label}
              onChange={e => setLabel(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}>
            <label>DON!! cost</label>
            <input type="number" min={1} max={10} value={attachCost}
              onChange={e => setAttachCost(Math.max(1, Number(e.target.value)))} />
          </div>
          <button onClick={addAttach} disabled={remaining < attachCost}>Attach</button>
        </div>

        {attached.length > 0 && (
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Attachments</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {attached.map((cost, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#e74c3c', fontWeight: 700 }}>+{cost} DON!!</span>
                  <span style={{ color: 'var(--text-muted)' }}>attached</span>
                  <button onClick={() => removeAttach(i)} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button onClick={nextTurn} disabled={turn >= 10}>Next Turn (refresh DON!!)</button>
          <button onClick={reset} style={{ fontSize: '0.8rem' }}>Reset</button>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          DON!! rule: gain 2 per turn (max 10). Attached DON!! become rested and refresh at end of turn.
        </div>
      </div>
    </ConverterShell>
  );
}
