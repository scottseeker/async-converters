import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

export default function RandomizeLines() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  function shuffle() {
    const lines = input.split('\n');
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    setOutput(lines.join('\n'));
  }

  return (
    <ConverterShell title="Randomize Lines" description="Shuffle lines in text into a random order." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="rl-in">Input Text</label>
          <textarea id="rl-in" style={{ minHeight: 180 }} placeholder="Paste lines here…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.actions}>
          <button onClick={shuffle} disabled={!input.trim()}>Shuffle Lines</button>
        </div>
        {output && (
          <>
            <div className={styles.field}>
              <label>Shuffled Result</label>
              <textarea className={styles.outputArea} readOnly value={output} />
            </div>
            <div className={styles.actions}>
              <button onClick={() => navigator.clipboard.writeText(output)}>Copy Result</button>
              <button onClick={shuffle}>Shuffle Again</button>
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
