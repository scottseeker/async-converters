import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './student.module.css';

function getGrade(pct: number) {
  if (pct >= 93) return 'A';
  if (pct >= 90) return 'A-';
  if (pct >= 87) return 'B+';
  if (pct >= 83) return 'B';
  if (pct >= 80) return 'B-';
  if (pct >= 77) return 'C+';
  if (pct >= 73) return 'C';
  if (pct >= 70) return 'C-';
  if (pct >= 67) return 'D+';
  if (pct >= 63) return 'D';
  if (pct >= 60) return 'D-';
  return 'F';
}

export default function GradePercentage() {
  const [mode, setMode] = useState<'scored' | 'needed'>('scored');
  const [score, setScore] = useState('');
  const [total, setTotal] = useState('');
  const [current, setCurrent] = useState('');
  const [desired, setDesired] = useState('');
  const [weight, setWeight] = useState('');

  const s = parseFloat(score);
  const t = parseFloat(total);
  const pct = !isNaN(s) && !isNaN(t) && t > 0 ? (s / t) * 100 : null;

  // What grade do I need on final?
  const cur = parseFloat(current) / 100;
  const des = parseFloat(desired) / 100;
  const w = parseFloat(weight) / 100;
  const needed = cur !== undefined && des !== undefined && w > 0 && w < 1
    ? ((des - cur * (1 - w)) / w) * 100 : null;

  return (
    <ConverterShell title="Grade Percentage Calculator" description="Convert scores to letter grades or calculate what you need on a final exam." category="student">
      <div className={styles.form}>
        <div className={styles.actions}>
          <button style={mode === 'scored' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode('scored')}>Score → Grade</button>
          <button style={mode === 'needed' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode('needed')}>What grade do I need?</button>
        </div>
        {mode === 'scored' ? (
          <>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
                <label>Points scored</label>
                <input type="number" min="0" step="0.5" placeholder="85" value={score} onChange={e => setScore(e.target.value)} />
              </div>
              <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
                <label>Total points</label>
                <input type="number" min="1" step="0.5" placeholder="100" value={total} onChange={e => setTotal(e.target.value)} />
              </div>
            </div>
            {pct !== null && (
              <div className={styles.stats}>
                <div className={styles.stat}><div className={styles.statNum}>{pct.toFixed(1)}%</div><div className={styles.statLabel}>Percentage</div></div>
                <div className={styles.stat}><div className={styles.statNum}>{getGrade(pct)}</div><div className={styles.statLabel}>Letter grade</div></div>
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
                <label>Current grade (%)</label>
                <input type="number" min="0" max="100" placeholder="78" value={current} onChange={e => setCurrent(e.target.value)} />
              </div>
              <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
                <label>Desired grade (%)</label>
                <input type="number" min="0" max="100" placeholder="80" value={desired} onChange={e => setDesired(e.target.value)} />
              </div>
              <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
                <label>Final weight (%)</label>
                <input type="number" min="1" max="100" placeholder="20" value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
            </div>
            {needed !== null && (
              <div className={styles.stats}>
                <div className={styles.stat}><div className={styles.statNum} style={{ color: needed > 100 ? '#e55' : 'var(--accent)' }}>{needed.toFixed(1)}%</div><div className={styles.statLabel}>Needed on final</div></div>
                <div className={styles.stat}><div className={styles.statNum}>{getGrade(needed)}</div><div className={styles.statLabel}>= letter grade</div></div>
              </div>
            )}
          </>
        )}
      </div>
    </ConverterShell>
  );
}
