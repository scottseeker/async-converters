import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './student.module.css';

export default function ReadingTimeEst() {
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(200);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minutes = words / wpm;
  const mins = Math.floor(minutes);
  const secs = Math.round((minutes - mins) * 60);

  return (
    <ConverterShell title="Reading Time Estimator" description="Estimate how long it takes to read any text at a given words-per-minute rate." category="student">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="rte-wpm">Reading speed: {wpm} wpm</label>
          <input id="rte-wpm" type="range" min={100} max={500} step={25} value={wpm} onChange={e => setWpm(Number(e.target.value))} />
        </div>
        <div className={styles.field}>
          <label htmlFor="rte-text">Text</label>
          <textarea id="rte-text" style={{ minHeight: 180 }} placeholder="Paste your text here…" value={text} onChange={e => setText(e.target.value)} />
        </div>
        {words > 0 && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>{words.toLocaleString()}</div><div className={styles.statLabel}>Words</div></div>
            <div className={styles.stat}><div className={styles.statNum}>{mins}m {secs}s</div><div className={styles.statLabel}>Reading time</div></div>
            <div className={styles.stat}><div className={styles.statNum}>{Math.ceil(minutes)}</div><div className={styles.statLabel}>Minutes (rounded)</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
