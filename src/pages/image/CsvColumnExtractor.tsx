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
  return rows.map(r => r.map(c => (c.includes(',') || c.includes('"') || c.includes('\n')) ? `"${c.replace(/"/g, '""')}"` : c).join(',')).join('\n');
}

export default function CsvColumnExtractor() {
  const [csv, setCsv] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [result, setResult] = useState('');

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      setCsv(text); setResult(''); setSelected(new Set());
      const rows = parseCsv(text);
      if (rows.length) setHeaders(rows[0]);
    };
    reader.readAsText(f);
  }

  function toggle(i: number) { setSelected(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; }); }

  function extract() {
    const rows = parseCsv(csv);
    const cols = Array.from(selected).sort((a, b) => a - b);
    const out = rows.map(row => cols.map(c => row[c] ?? ''));
    setResult(toCsv(out));
  }

  function download() {
    const blob = new Blob([result], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'extracted.csv'; a.click();
  }

  return (
    <ConverterShell title="CSV Column Extractor" description="Select and extract specific columns from a CSV file." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload CSV</label><input type="file" accept=".csv,text/csv" onChange={onFile} /></div>
        {csv && !headers.length && <div className={styles.field}><label>Or paste CSV</label><textarea value={csv} onChange={e => { setCsv(e.target.value); const r = parseCsv(e.target.value); if (r.length) setHeaders(r[0]); }} rows={4} /></div>}
        {!csv && <div className={styles.field}><label>Or paste CSV</label><textarea value={csv} onChange={e => { setCsv(e.target.value); const r = parseCsv(e.target.value); if (r.length) setHeaders(r[0]); }} rows={4} placeholder="col1,col2,col3&#10;a,b,c" /></div>}
        {headers.length > 0 && (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {headers.map((h, i) => (
                <label key={i} style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', padding: '0.25rem 0.6rem', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', background: selected.has(i) ? 'var(--accent)' : 'transparent', color: selected.has(i) ? '#fff' : 'inherit' }}>
                  <input type="checkbox" checked={selected.has(i)} onChange={() => toggle(i)} style={{ display: 'none' }} />{h}
                </label>
              ))}
            </div>
            <div className={styles.actions}><button onClick={extract} disabled={selected.size === 0}>Extract</button></div>
          </>
        )}
        {result && (
          <>
            <div className={styles.field}><label>Result ({parseCsv(result).length} rows)</label><textarea className={styles.outputArea} readOnly value={result} rows={8} /></div>
            <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(result)}>Copy</button><button onClick={download}>Download CSV</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
