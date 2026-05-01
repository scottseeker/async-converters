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

function isNum(s: string): boolean { return s !== '' && !isNaN(Number(s)); }

export default function CsvSorter() {
  const [csv, setCsv] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [sortCol, setSortCol] = useState(0);
  const [dir, setDir] = useState<'asc' | 'desc'>('asc');
  const [result, setResult] = useState('');

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => { const text = ev.target?.result as string; setCsv(text); setResult(''); const r = parseCsv(text); if (r.length) setHeaders(r[0]); };
    reader.readAsText(f);
  }

  function sort() {
    const rows = parseCsv(csv);
    if (rows.length < 2) { setResult(csv); return; }
    const [header, ...data] = rows;
    const sorted = [...data].sort((a, b) => {
      const va = a[sortCol] ?? '', vb = b[sortCol] ?? '';
      const numericA = isNum(va), numericB = isNum(vb);
      let cmp = 0;
      if (numericA && numericB) cmp = Number(va) - Number(vb);
      else cmp = va.localeCompare(vb);
      return dir === 'asc' ? cmp : -cmp;
    });
    setResult(toCsv([header, ...sorted]));
  }

  function download() {
    const blob = new Blob([result], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'sorted.csv'; a.click();
  }

  return (
    <ConverterShell title="CSV Sorter" description="Sort CSV rows by any column, ascending or descending." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload CSV</label><input type="file" accept=".csv" onChange={onFile} /></div>
        <div className={styles.field}><label>Or paste CSV</label><textarea value={csv} onChange={e => { setCsv(e.target.value); setResult(''); const r = parseCsv(e.target.value); if (r.length) setHeaders(r[0]); }} rows={4} placeholder="name,age&#10;Charlie,28&#10;Alice,22&#10;Bob,35" /></div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {headers.length > 0 && (
            <div className={styles.field} style={{ flex: 2, minWidth: 120 }}>
              <label>Sort by</label>
              <select value={sortCol} onChange={e => setSortCol(Number(e.target.value))}>
                {headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
              </select>
            </div>
          )}
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}>
            <label>Direction</label>
            <select value={dir} onChange={e => setDir(e.target.value as 'asc' | 'desc')}>
              <option value="asc">Ascending ↑</option>
              <option value="desc">Descending ↓</option>
            </select>
          </div>
        </div>
        <div className={styles.actions}><button onClick={sort} disabled={!csv}>Sort</button></div>
        {result && (
          <>
            <div className={styles.field}><label>Result</label><textarea className={styles.outputArea} readOnly value={result} rows={8} /></div>
            <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(result)}>Copy</button><button onClick={download}>Download CSV</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
