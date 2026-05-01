import { useState, useEffect, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './student.module.css';

export default function StudyTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [initial, setInitial] = useState(25);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s > 0) return s - 1;
          setMinutes(m => {
            if (m > 0) { return m - 1; }
            setRunning(false);
            clearInterval(intervalRef.current!);
            return 0;
          });
          return s > 0 ? s - 1 : 59;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  function start() { setRunning(true); }
  function pause() { setRunning(false); }
  function reset() { setRunning(false); setMinutes(initial); setSeconds(0); }

  const pct = ((initial * 60 - minutes * 60 - seconds) / (initial * 60)) * 100;

  return (
    <ConverterShell title="Study Timer" description="A simple countdown timer to help you stay focused during study sessions." category="student">
      <div className={styles.form}>
        {!running && minutes === initial && seconds === 0 && (
          <div className={styles.field} style={{ maxWidth: 200 }}>
            <label htmlFor="st-min">Duration (minutes): {initial}</label>
            <input id="st-min" type="range" min={1} max={120} value={initial} onChange={e => { const v = Number(e.target.value); setInitial(v); setMinutes(v); setSeconds(0); }} />
          </div>
        )}
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ fontSize: '4rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: minutes === 0 && seconds === 0 ? '#e55' : 'var(--accent)' }}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: 6, height: 6, overflow: 'hidden', margin: '1rem auto', maxWidth: 300 }}>
            <div style={{ width: `${pct}%`, background: 'var(--accent)', height: '100%', transition: 'width 1s linear' }} />
          </div>
          {minutes === 0 && seconds === 0 && <p style={{ color: '#e55', fontWeight: 600 }}>⏰ Time's up!</p>}
        </div>
        <div className={styles.actions} style={{ justifyContent: 'center' }}>
          {!running ? <button onClick={start} disabled={minutes === 0 && seconds === 0}>▶ Start</button> : <button onClick={pause}>⏸ Pause</button>}
          <button onClick={reset}>↺ Reset</button>
        </div>
      </div>
    </ConverterShell>
  );
}
