import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

function parseCsv(text: string): string[][] {
  return text.trim().split('\n').map(line => {
    const cols: string[] = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQ = !inQ; continue; }
      if (line[i] === ',' && !inQ) { cols.push(cur); cur = ''; continue; }
      cur += line[i];
    }
    cols.push(cur);
    return cols;
  });
}

function toCsv(rows: string[][]): string {
  return rows.map(r => r.map(c => (c.includes(',') || c.includes('"')) ? `"${c.replace(/"/g, '""')}"` : c).join(',')).join('\n');
}

export default function CsvDeduplicator() {
  const [csv, setCsv] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [keyCol, setKeyCol] = useState(0);
  const [result, setResult] = useState('');
  const [stats, setStats] = useState({ total: 0, dupes: 0 });

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      setCsv(text); setResult('');
      const rows = parseCsv(text);
      if (rows.length) setHeaders(rows[0]);
    };
    reader.readAsText(f);
  }

  function dedup() {
    const rows = parseCsv(csv);
    if (rows.length < 2) { setResult(csv); return; }
    const [header, ...data] = rows;
    const seen = new Set<string>();
    const unique = data.filter(row => {
      const key = row[keyCol] ?? '';
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
    setStats({ total: data.length, dupes: data.length - unique.length });
    setResult(toCsv([header, ...unique]));
  }

  function download() {
    const blob = new Blob([result], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'deduped.csv'; a.click();
  }

  return (
    <ConverterShell title="CSV Deduplicator" description="Remove duplicate rows from a CSV file based on a key column." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload CSV</label><input type="file" accept=".csv" onChange={onFile} /></div>
        <div className={styles.field}><label>Or paste CSV</label><textarea value={csv} onChange={e => { setCsv(e.target.value); const r = parseCsv(e.target.value); if (r.length) setHeaders(r[0]); }} rows={4} placeholder="id,name,email&#10;1,Alice,alice@ex.com&#10;2,Bob,bob@ex.com&#10;1,Alice,alice@ex.com" /></div>
        {headers.length > 0 && (
          <div className={styles.field}>
            <label>Key column</label>
            <select value={keyCol} onChange={e => setKeyCol(Number(e.target.value))}>
              {headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
            </select>
          </div>
        )}
        <div className={styles.actions}><button onClick={dedup} disabled={!csv}>Deduplicate</button></div>
        {result && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}><div className={styles.statNum}>{stats.total}</div><div className={styles.statLabel}>Total rows</div></div>
              <div className={styles.stat}><div className={styles.statNum} style={{ color: 'var(--error)' }}>{stats.dupes}</div><div className={styles.statLabel}>Removed</div></div>
              <div className={styles.stat}><div className={styles.statNum} style={{ color: 'var(--success)' }}>{stats.total - stats.dupes}</div><div className={styles.statLabel}>Remaining</div></div>
            </div>
            <div className={styles.field}><label>Result</label><textarea className={styles.outputArea} readOnly value={result} rows={8} /></div>
            <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(result)}>Copy</button><button onClick={download}>Download CSV</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
