import { useState, useEffect, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './student.module.css';

type Phase = 'work' | 'break' | 'long-break';

export default function Pomodoro() {
  const [workMins, setWorkMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  const [longBreakMins, setLongBreakMins] = useState(15);
  const [sessions, setSessions] = useState(4);
  const [phase, setPhase] = useState<Phase>('work');
  const [secs, setSecs] = useState(workMins * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function phaseDuration(p: Phase) {
    return (p === 'work' ? workMins : p === 'break' ? breakMins : longBreakMins) * 60;
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecs(s => {
          if (s > 1) return s - 1;
          // Advance phase
          setPhase(p => {
            if (p === 'work') {
              const newDone = done + 1;
              setDone(newDone);
              const next: Phase = newDone % sessions === 0 ? 'long-break' : 'break';
              setSecs(phaseDuration(next));
              return next;
            } else {
              setSecs(phaseDuration('work'));
              return 'work';
            }
          });
          return 0;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, done, sessions, workMins, breakMins, longBreakMins]);

  function reset() { setRunning(false); setPhase('work'); setSecs(workMins * 60); setDone(0); }

  const total = phaseDuration(phase);
  const pct = ((total - secs) / total) * 100;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const PHASE_COLORS: Record<Phase, string> = { work: 'var(--accent)', break: '#4caf50', 'long-break': '#2196f3' };

  return (
    <ConverterShell title="Pomodoro Timer" description="Study with the Pomodoro technique — work intervals with scheduled breaks." category="student">
      <div className={styles.form}>
        {!running && done === 0 && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[['Work (min)', workMins, setWorkMins] as const, ['Break (min)', breakMins, setBreakMins] as const, ['Long break (min)', longBreakMins, setLongBreakMins] as const, ['Sessions', sessions, setSessions] as const].map(([label, val, setter]) => (
              <div key={String(label)} className={styles.field} style={{ flex: 1, minWidth: 100 }}>
                <label>{label}: {val}</label>
                <input type="range" min={1} max={label.includes('Session') ? 8 : 60} value={val} onChange={e => setter(Number(e.target.value) as never)} />
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: PHASE_COLORS[phase], marginBottom: '0.5rem' }}>
            {phase === 'work' ? '🍅 Work' : phase === 'break' ? '☕ Break' : '🌟 Long Break'}
          </div>
          <div style={{ fontSize: '4rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: PHASE_COLORS[phase] }}>
            {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: 6, height: 8, overflow: 'hidden', margin: '1rem auto', maxWidth: 320 }}>
            <div style={{ width: `${pct}%`, background: PHASE_COLORS[phase], height: '100%', transition: 'width 1s linear' }} />
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Session {done + 1} of {sessions}</div>
        </div>
        <div className={styles.actions} style={{ justifyContent: 'center' }}>
          {!running ? <button onClick={() => setRunning(true)}>▶ Start</button> : <button onClick={() => setRunning(false)}>⏸ Pause</button>}
          <button onClick={reset}>↺ Reset</button>
        </div>
      </div>
    </ConverterShell>
  );
}
