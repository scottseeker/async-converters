import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './time.module.css';

const TIMEZONES = Intl.supportedValuesOf('timeZone');

function formatInZone(date: Date, tz: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true,
  }).format(date);
}

export default function TimezoneConverter() {
  const [datetime, setDatetime] = useState(() => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  });
  const [fromTz, setFromTz] = useState('UTC');
  const [toTz, setToTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  let result = '';
  try {
    const date = new Date(datetime + ':00Z');
    // Adjust: parse local time in fromTz
    const offset = getUtcOffset(datetime, fromTz);
    const utcMs = date.getTime() - offset * 60000;
    result = formatInZone(new Date(utcMs), toTz);
  } catch {
    result = 'Invalid input';
  }

  return (
    <ConverterShell title="Time Zone Converter" description="Convert a date and time from one timezone to another." category="time">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="dt">Date & Time</label>
          <input id="dt" type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)} />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="from-tz">From Timezone</label>
            <select id="from-tz" value={fromTz} onChange={e => setFromTz(e.target.value)}>
              {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="to-tz">To Timezone</label>
            <select id="to-tz" value={toTz} onChange={e => setToTz(e.target.value)}>
              {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.resultBox}>
          <div className={styles.resultLabel}>Result</div>
          <div className={styles.resultValue} aria-live="polite">{result || '—'}</div>
        </div>
      </div>
    </ConverterShell>
  );
}

function getUtcOffset(localIso: string, tz: string): number {
  // Returns the UTC offset in minutes for the given local time in the given tz
  const testDate = new Date(localIso + ':00Z');
  const locStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).format(testDate);
  const [datePart, timePart] = locStr.split(', ');
  const [y, mo, d] = datePart.split('-').map(Number);
  const [h, m, s] = timePart.split(':').map(Number);
  const localInTz = Date.UTC(y, mo - 1, d, h, m, s);
  return (testDate.getTime() - localInTz) / 60000;
}
