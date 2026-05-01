import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

export default function DedupeLines() {
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);

  const lines = input === '' ? [] : input.split('\n');
  const seen = new Set<string>();
  const unique = lines.filter(l => {
    const key = caseSensitive ? l : l.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const removed = lines.length - unique.length;
  const output = unique.join('\n');

  return (
    <ConverterShell title="Duplicate Line Remover" description="Remove duplicate lines from text, keeping only unique entries." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="dl-in">Input Text</label>
          <textarea id="dl-in" style={{ minHeight: 180 }} placeholder="Paste lines here…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.actions}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} />
            Case sensitive
          </label>
        </div>
        {input && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}><div className={styles.statNum}>{lines.length}</div><div className={styles.statLabel}>Input lines</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{unique.length}</div><div className={styles.statLabel}>Unique lines</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{removed}</div><div className={styles.statLabel}>Removed</div></div>
            </div>
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
