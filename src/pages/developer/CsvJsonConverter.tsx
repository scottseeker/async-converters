import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

function csvToJson(csv: string): string {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) throw new Error('Need at least a header row and one data row');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
  });
  return JSON.stringify(rows, null, 2);
}

function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data) || data.length === 0) throw new Error('Input must be a non-empty JSON array');
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
  return [headers.join(','), ...rows].join('\n');
}

export default function CsvJsonConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function convert(fn: (s: string) => string) {
    setError(''); setOutput('');
    try { setOutput(fn(input)); }
    catch (e) { setError((e as Error).message); }
  }

  return (
    <ConverterShell title="CSV ↔ JSON Converter" description="Convert CSV data to JSON and back." category="developer">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="csj-in">Input (CSV or JSON)</label>
          <textarea id="csj-in" className={styles.codeArea} placeholder="Paste CSV or JSON array here…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.actions}>
          <button className="btn-primary" onClick={() => convert(csvToJson)}>CSV → JSON</button>
          <button className="btn-secondary" onClick={() => convert(jsonToCsv)}>JSON → CSV</button>
        </div>
        {error && <p className={styles.error}>⚠ {error}</p>}
        {output && (
          <div className={styles.field}>
            <label>Output</label>
            <textarea className={styles.codeArea} readOnly value={output} />
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
