import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

const FIELDS = [
  { id: 'min', label: 'Minute', range: '0-59', opts: ['*','*/5','*/10','*/15','*/30','0'] },
  { id: 'hour', label: 'Hour', range: '0-23', opts: ['*','*/6','*/12','0','12'] },
  { id: 'dom', label: 'Day of month', range: '1-31', opts: ['*','1','15','L'] },
  { id: 'month', label: 'Month', range: '1-12', opts: ['*','1','6','12'] },
  { id: 'dow', label: 'Day of week', range: '0-6', opts: ['*','1','5','1-5','0,6'] },
];

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every Monday 9am', value: '0 9 * * 1' },
  { label: 'First day of month', value: '0 0 1 * *' },
  { label: 'Every weekday 8am', value: '0 8 * * 1-5' },
];

function describe(cron: string): string {
  const [min, hour, dom, month, dow] = cron.split(' ');
  if (!min) return '';
  const parts = [];
  if (min === '*') parts.push('every minute');
  else if (min.startsWith('*/')) parts.push(`every ${min.slice(2)} minutes`);
  else parts.push(`at minute ${min}`);
  if (hour !== '*') parts.push(`hour ${hour}`);
  if (dom !== '*') parts.push(`on day ${dom} of month`);
  if (month !== '*') parts.push(`in month ${month}`);
  if (dow !== '*') parts.push(`on weekday ${dow}`);
  return parts.join(', ');
}

export default function CronGenerator() {
  const [parts, setParts] = useState(['*', '*', '*', '*', '*']);

  const cron = parts.join(' ');
  const desc = describe(cron);

  return (
    <ConverterShell title="Cron Generator" description="Build and preview cron expressions with a visual editor." category="developer">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          {PRESETS.map(p => <button key={p.label} style={{ fontSize: '0.8rem' }} onClick={() => setParts(p.value.split(' '))}>{p.label}</button>)}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {FIELDS.map((f, i) => (
            <div key={f.id} className={styles.field} style={{ flex: 1, minWidth: 100 }}>
              <label>{f.label} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({f.range})</span></label>
              <input type="text" value={parts[i]} onChange={e => { const p = [...parts]; p[i] = e.target.value; setParts(p); }} style={{ fontFamily: 'var(--font-mono)' }} />
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                {f.opts.map(o => <button key={o} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }} onClick={() => { const p = [...parts]; p[i] = o; setParts(p); }}>{o}</button>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--bg-card)', borderRadius: 8, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>{cron}</div>
          {desc && <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>→ {desc}</div>}
        </div>
        <div className={styles.actions}>
          <button onClick={() => navigator.clipboard.writeText(cron)}>Copy</button>
        </div>
      </div>
    </ConverterShell>
  );
}
