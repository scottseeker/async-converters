import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

export default function TimestampDiff() {
  const [ts1, setTs1] = useState('');
  const [ts2, setTs2] = useState('');

  function parse(v: string): Date | null {
    if (!v.trim()) return null;
    // Unix timestamp (number)
    if (/^\d{10}$/.test(v.trim())) return new Date(parseInt(v) * 1000);
    if (/^\d{13}$/.test(v.trim())) return new Date(parseInt(v));
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  const d1 = parse(ts1), d2 = parse(ts2);
  const diffMs = d1 && d2 ? Math.abs(d2.getTime() - d1.getTime()) : null;

  const secs = diffMs !== null ? Math.floor(diffMs / 1000) : null;
  const mins = secs !== null ? Math.floor(secs / 60) : null;
  const hours = mins !== null ? Math.floor(mins / 60) : null;
  const days = hours !== null ? Math.floor(hours / 24) : null;

  return (
    <ConverterShell title="Timestamp Diff" description="Calculate the difference between two timestamps in multiple units." category="developer">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 180 }}>
            <label>Timestamp 1</label>
            <input type="text" placeholder="2024-01-01 or 1704067200" value={ts1} onChange={e => setTs1(e.target.value)} style={{ fontFamily: 'var(--font-mono)' }} />
            {d1 && <small style={{ color: 'var(--text-muted)' }}>{d1.toISOString()}</small>}
            {ts1 && !d1 && <small style={{ color: '#e55' }}>Invalid</small>}
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 180 }}>
            <label>Timestamp 2</label>
            <input type="text" placeholder="2024-12-31 or now" value={ts2} onChange={e => setTs2(e.target.value)} style={{ fontFamily: 'var(--font-mono)' }} />
            {d2 && <small style={{ color: 'var(--text-muted)' }}>{d2.toISOString()}</small>}
            {ts2 && !d2 && <small style={{ color: '#e55' }}>Invalid</small>}
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={() => setTs2(new Date().toISOString())}>Set T2 = Now</button>
        </div>
        {diffMs !== null && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>{days}</div><div className={styles.statLabel}>Days</div></div>
            <div className={styles.stat}><div className={styles.statNum}>{hours}</div><div className={styles.statLabel}>Hours</div></div>
            <div className={styles.stat}><div className={styles.statNum}>{mins}</div><div className={styles.statLabel}>Minutes</div></div>
            <div className={styles.stat}><div className={styles.statNum}>{secs}</div><div className={styles.statLabel}>Seconds</div></div>
            <div className={styles.stat}><div className={styles.statNum}>{diffMs.toLocaleString()}</div><div className={styles.statLabel}>Milliseconds</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
