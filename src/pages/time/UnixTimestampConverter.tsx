import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './time.module.css';

export default function UnixTimestampConverter() {
  const [epoch, setEpoch] = useState('');
  const [human, setHuman] = useState('');
  const [epochResult, setEpochResult] = useState('');
  const [humanResult, setHumanResult] = useState('');

  function epochToHuman() {
    const n = parseInt(epoch, 10);
    if (isNaN(n)) { setHumanResult('Invalid epoch'); return; }
    const d = new Date(n * 1000);
    setHumanResult(d.toUTCString() + `\nLocal: ${d.toString()}`);
  }

  function humanToEpoch() {
    const d = new Date(human);
    if (isNaN(d.getTime())) { setEpochResult('Invalid date'); return; }
    setEpochResult(Math.floor(d.getTime() / 1000).toString());
  }

  function useNow() {
    const now = Math.floor(Date.now() / 1000);
    setEpoch(now.toString());
    const d = new Date(now * 1000);
    setHumanResult(d.toUTCString() + `\nLocal: ${d.toString()}`);
  }

  return (
    <ConverterShell title="Unix Timestamp" description="Convert Unix epoch seconds to human-readable dates and back." category="time">
      <div className={styles.form}>
        <div className={styles.twoCol}>
          <div>
            <div className={styles.field} style={{ marginBottom: '0.5rem' }}>
              <label htmlFor="epoch-in">Epoch (seconds)</label>
              <input id="epoch-in" type="number" placeholder="e.g. 1714262400" value={epoch} onChange={e => setEpoch(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-primary" onClick={epochToHuman}>Convert →</button>
              <button className="btn-secondary" onClick={useNow}>Use Now</button>
            </div>
            {humanResult && (
              <div className={styles.resultBox} style={{ marginTop: '0.75rem', whiteSpace: 'pre-line' }}>
                <div className={styles.resultLabel}>Date / Time</div>
                <div className={styles.resultValue} style={{ fontSize: '0.875rem' }}>{humanResult}</div>
              </div>
            )}
          </div>

          <div>
            <div className={styles.field} style={{ marginBottom: '0.5rem' }}>
              <label htmlFor="human-in">Date / Time string</label>
              <input id="human-in" type="text" placeholder="e.g. 2024-04-28T00:00:00Z" value={human} onChange={e => setHuman(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={humanToEpoch}>Convert →</button>
            {epochResult && (
              <div className={styles.resultBox} style={{ marginTop: '0.75rem' }}>
                <div className={styles.resultLabel}>Epoch (seconds)</div>
                <div className={styles.resultValue}>{epochResult}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConverterShell>
  );
}
