import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

export default function ReverseText() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'chars' | 'words' | 'lines'>('chars');

  function reverse(text: string) {
    if (mode === 'chars') return text.split('').reverse().join('');
    if (mode === 'words') return text.split(/(\s+)/).reverse().join('');
    if (mode === 'lines') return text.split('\n').reverse().join('\n');
    return text;
  }

  const output = reverse(input);

  return (
    <ConverterShell title="Reverse Text" description="Reverse text by characters, words, or lines." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="rv-in">Input Text</label>
          <textarea id="rv-in" style={{ minHeight: 120 }} placeholder="Enter text to reverse…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.actions}>
          {(['chars', 'words', 'lines'] as const).map(m => (
            <button key={m} style={mode === m ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode(m)}>
              Reverse {m}
            </button>
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
