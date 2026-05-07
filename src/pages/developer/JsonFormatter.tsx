import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import JsonTreeViewer from '../../components/JsonTreeViewer/JsonTreeViewer';
import styles from './developer.module.css';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<JsonValue | null>(null);
  const [minified, setMinified] = useState('');
  const [mode, setMode] = useState<'pretty' | 'minify' | null>(null);
  const [error, setError] = useState('');

  function format() {
    setError('');
    setMinified('');
    try {
      const result = JSON.parse(input) as JsonValue;
      setParsed(result);
      setMode('pretty');
    } catch (e) {
      setParsed(null);
      setMode(null);
      setError((e as Error).message);
    }
  }

  function minify() {
    setError('');
    setParsed(null);
    try {
      const result = JSON.parse(input) as JsonValue;
      setMinified(JSON.stringify(result));
      setMode('minify');
    } catch (e) {
      setMinified('');
      setMode(null);
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
        </div>
        {error && <p className={styles.error}>⚠ {error}</p>}
        {mode === 'pretty' && parsed !== null && (
          <div className={styles.field}>
            <label>Output</label>
            <JsonTreeViewer value={parsed} />
          </div>
        )}
        {mode === 'minify' && minified && (
          <div className={styles.field}>
            <label>Output</label>
            <textarea className={styles.codeArea} readOnly value={minified} />
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
