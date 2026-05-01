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

export default function CsvSplitter() {
  const [csv, setCsv] = useState('');
  const [chunkSize, setChunkSize] = useState(100);
  const [chunks, setChunks] = useState<string[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => { const text = ev.target?.result as string; setCsv(text); setChunks([]); const r = parseCsv(text); if (r.length) setHeaders(r[0]); };
    reader.readAsText(f);
  }

  function split() {
    const rows = parseCsv(csv);
    if (rows.length < 2) return;
    const [header, ...data] = rows;
    const out: string[] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      out.push(toCsv([header, ...data.slice(i, i + chunkSize)]));
    }
    setChunks(out);
  }

  function downloadAll() {
    chunks.forEach((c, i) => {
      const blob = new Blob([c], { type: 'text/csv' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `split_${i + 1}.csv`; a.click();
    });
  }

  const totalRows = csv ? Math.max(0, parseCsv(csv).length - 1) : 0;

  return (
    <ConverterShell title="CSV Splitter" description="Split a large CSV file into smaller chunks by row count." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Upload CSV</label><input type="file" accept=".csv" onChange={onFile} /></div>
        <div className={styles.field}><label>Or paste CSV</label><textarea value={csv} onChange={e => { setCsv(e.target.value); setChunks([]); const r = parseCsv(e.target.value); if (r.length) setHeaders(r[0]); }} rows={4} placeholder="id,name&#10;1,Alice&#10;2,Bob..." /></div>
        {headers.length > 0 && <p style={{ color: 'var(--muted)', margin: 0 }}>{totalRows} data rows · {headers.length} columns</p>}
        <div className={styles.field} style={{ maxWidth: 220 }}>
          <label>Rows per chunk</label>
          <input type="number" min={1} max={100000} value={chunkSize} onChange={e => setChunkSize(Math.max(1, Number(e.target.value)))} />
        </div>
        <div className={styles.actions}><button onClick={split} disabled={!csv}>Split</button></div>
        {chunks.length > 0 && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}><div className={styles.statNum}>{chunks.length}</div><div className={styles.statLabel}>Files</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{chunkSize}</div><div className={styles.statLabel}>Rows/file</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{totalRows}</div><div className={styles.statLabel}>Total rows</div></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 280, overflowY: 'auto' }}>
              {chunks.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>split_{i + 1}.csv — {parseCsv(c).length - 1} rows</span>
                  <button onClick={() => { const blob = new Blob([c], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `split_${i + 1}.csv`; a.click(); }}>Download</button>
                </div>
              ))}
            </div>
            <div className={styles.actions}><button onClick={downloadAll}>Download All</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
