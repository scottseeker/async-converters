import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  function format() {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function minify() {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ConverterShell title="JSON Formatter / Minifier" description="Format, minify, and validate JSON." category="developer">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="json-in">JSON Input</label>
          <textarea id="json-in" className={styles.codeArea} placeholder='{"key": "value"}' value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.actions}>
          <button className="btn-primary" onClick={format}>Format (pretty)</button>
          <button className="btn-secondary" onClick={minify}>Minify</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            <label style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>Indent:</label>
            <select value={indent} onChange={e => setIndent(Number(e.target.value))} style={{ width: 70 }}>
              {[2, 4].map(n => <option key={n} value={n}>{n} spaces</option>)}
            </select>
          </div>
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
