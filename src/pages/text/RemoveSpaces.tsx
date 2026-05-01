import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

export default function RemoveSpaces() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'extra' | 'all' | 'tabs' | 'lines'>('extra');

  function process(text: string) {
    if (mode === 'extra') return text.replace(/[ \t]+/g, ' ').replace(/^ /gm, '').replace(/ $/gm, '');
    if (mode === 'all') return text.replace(/\s+/g, ' ').trim();
    if (mode === 'tabs') return text.replace(/\t/g, ' ');
    if (mode === 'lines') return text.split('\n').filter(l => l.trim() !== '').join('\n');
    return text;
  }

  const output = process(input);

  return (
    <ConverterShell title="Remove Extra Spaces" description="Clean up extra whitespace, tabs, and blank lines from text." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="rs-in">Input Text</label>
          <textarea id="rs-in" style={{ minHeight: 180 }} placeholder="Paste text here…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.actions}>
          {([['extra', 'Extra spaces'], ['all', 'All whitespace'], ['tabs', 'Tabs → spaces'], ['lines', 'Blank lines']] as [typeof mode, string][]).map(([m, label]) => (
            <button key={m} style={mode === m ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode(m)}>{label}</button>
          ))}
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
