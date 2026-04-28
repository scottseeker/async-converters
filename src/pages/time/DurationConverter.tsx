import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './time.module.css';

function secondsToHms(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function hmsToSeconds(hms: string) {
  const parts = hms.split(':').map(Number);
  if (parts.some(isNaN)) return NaN;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0];
}

export default function DurationConverter() {
  const [seconds, setSeconds] = useState('');
  const [hms, setHms] = useState('');
  const [secResult, setSecResult] = useState('');
  const [hmsResult, setHmsResult] = useState('');

  function handleSeconds() {
    const n = parseFloat(seconds);
    if (isNaN(n) || n < 0) { setHmsResult('Invalid seconds'); return; }
    setHmsResult(secondsToHms(n));
  }

  function handleHms() {
    const n = hmsToSeconds(hms);
    if (isNaN(n)) { setSecResult('Invalid HH:MM:SS'); return; }
    setSecResult(n.toString());
  }

  return (
    <ConverterShell title="Duration Converter" description="Convert between seconds and HH:MM:SS duration format." category="time">
      <div className={styles.form}>
        <div className={styles.twoCol}>
          <div>
            <div className={styles.field} style={{ marginBottom: '0.5rem' }}>
              <label htmlFor="sec-in">Seconds</label>
              <input id="sec-in" type="number" min="0" placeholder="e.g. 3661" value={seconds} onChange={e => setSeconds(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={handleSeconds}>Convert →</button>
            {hmsResult && (
              <div className={styles.resultBox} style={{ marginTop: '0.75rem' }}>
                <div className={styles.resultLabel}>HH:MM:SS</div>
                <div className={styles.resultValue}>{hmsResult}</div>
              </div>
            )}
          </div>

          <div>
            <div className={styles.field} style={{ marginBottom: '0.5rem' }}>
              <label htmlFor="hms-in">HH:MM:SS (or MM:SS or SS)</label>
              <input id="hms-in" type="text" placeholder="e.g. 01:01:01" value={hms} onChange={e => setHms(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={handleHms}>Convert →</button>
            {secResult && (
              <div className={styles.resultBox} style={{ marginTop: '0.75rem' }}>
                <div className={styles.resultLabel}>Seconds</div>
                <div className={styles.resultValue}>{secResult}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConverterShell>
  );
}
