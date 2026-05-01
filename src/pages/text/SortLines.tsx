import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

type SortMode = 'alpha-asc' | 'alpha-desc' | 'length-asc' | 'length-desc' | 'reverse';

export default function SortLines() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<SortMode>('alpha-asc');

  const lines = input === '' ? [] : input.split('\n');
  let sorted: string[];
  if (mode === 'alpha-asc') sorted = [...lines].sort((a, b) => a.localeCompare(b));
  else if (mode === 'alpha-desc') sorted = [...lines].sort((a, b) => b.localeCompare(a));
  else if (mode === 'length-asc') sorted = [...lines].sort((a, b) => a.length - b.length);
  else if (mode === 'length-desc') sorted = [...lines].sort((a, b) => b.length - a.length);
  else sorted = [...lines].reverse();
  const output = sorted.join('\n');

  return (
    <ConverterShell title="Sort Lines" description="Sort lines alphabetically, numerically, by length, or reverse." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="sl-in">Input Text</label>
          <textarea id="sl-in" style={{ minHeight: 180 }} placeholder="Paste lines here…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.actions}>
          {(['alpha-asc', 'alpha-desc', 'length-asc', 'length-desc', 'reverse'] as SortMode[]).map(m => (
            <button key={m} style={mode === m ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode(m)}>
              {m === 'alpha-asc' ? 'A → Z' : m === 'alpha-desc' ? 'Z → A' : m === 'length-asc' ? 'Shortest first' : m === 'length-desc' ? 'Longest first' : 'Reverse'}
            </button>
          ))}
        </div>
        {input && (
          <>
            <div className={styles.field}>
              <label>Result ({sorted.length} lines)</label>
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
