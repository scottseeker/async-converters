import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

function parseCron(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return 'Invalid cron expression (need 5 fields)';
  const [min, hour, dom, month, dow] = parts;
  const lines: string[] = [];

  function descField(val: string, unit: string): string {
    if (val === '*') return `every ${unit}`;
    if (val.startsWith('*/')) return `every ${val.slice(2)} ${unit}s`;
    if (val.includes('-')) return `${unit}s ${val}`;
    if (val.includes(',')) return `${unit}s ${val}`;
    return `at ${unit} ${val}`;
  }

  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTHS = ['','January','February','March','April','May','June','July','August','September','October','November','December'];

  lines.push(`Minutes:     ${descField(min, 'minute')}`);
  lines.push(`Hours:       ${descField(hour, 'hour')}`);
  lines.push(`Day/month:   ${dom === '*' ? 'every day' : 'day ' + dom}`);
  lines.push(`Month:       ${month === '*' ? 'every month' : MONTHS[parseInt(month)] || 'month ' + month}`);
  if (dow !== '*') {
    const d = parseInt(dow);
    lines.push(`Day/week:    ${!isNaN(d) ? DAYS[d] || dow : dow}`);
  } else {
    lines.push(`Day/week:    every day`);
  }

  return lines.join('\n');
}

export default function CronReader() {
  const [input, setInput] = useState('');

  const result = input.trim() ? parseCron(input) : '';

  return (
    <ConverterShell title="Cron Reader" description="Decode and explain what a cron expression does in plain English." category="developer">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="cr-in">Cron expression</label>
          <input id="cr-in" type="text" style={{ fontFamily: 'var(--font-mono)' }} placeholder="*/5 9-17 * * 1-5" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        {result && (
          <pre style={{ background: 'var(--bg-card)', borderRadius: 8, padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: 1.8 }}>{result}</pre>
        )}
      </div>
    </ConverterShell>
  );
}
