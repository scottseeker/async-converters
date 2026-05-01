import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

export default function RemoveLineBreaks() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'join' | 'double'>('join');

  const output = mode === 'join'
    ? input.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim()
    : input.replace(/\r?\n/g, '\n\n');

  return (
    <ConverterShell title="Remove Line Breaks" description="Join all lines into one paragraph, or convert single line breaks to double." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="rlb-in">Input Text</label>
          <textarea id="rlb-in" style={{ minHeight: 180 }} placeholder="Paste text with line breaks…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.actions}>
          <button style={mode === 'join' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode('join')}>Join all lines</button>
          <button style={mode === 'double' ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode('double')}>Single → Double breaks</button>
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
