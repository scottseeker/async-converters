import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

export default function AddLineNumbers() {
  const [input, setInput] = useState('');
  const [start, setStart] = useState(1);
  const [sep, setSep] = useState('. ');

  const lines = input === '' ? [] : input.split('\n');
  const output = lines.map((l, i) => `${i + start}${sep}${l}`).join('\n');

  return (
    <ConverterShell title="Add Line Numbers" description="Add sequential line numbers to every line of text." category="text">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="aln-start">Start number</label>
            <input id="aln-start" type="number" min={0} value={start} onChange={e => setStart(Number(e.target.value))} style={{ width: '100%' }} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="aln-sep">Separator</label>
            <input id="aln-sep" type="text" value={sep} onChange={e => setSep(e.target.value)} style={{ width: '100%', fontFamily: 'var(--font-mono)' }} />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="aln-in">Input Text</label>
          <textarea id="aln-in" style={{ minHeight: 180 }} placeholder="Paste lines here…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        {input && (
          <>
            <div className={styles.field}>
              <label>Result</label>
              <textarea className={styles.outputArea} readOnly value={output} />
            </div>
            <div className={styles.actions}>
              <button onClick={() => navigator.clipboard.writeText(output)}>Copy Result</button>
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
