import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

export default function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function encode() {
    setError('');
    try { setOutput(btoa(unescape(encodeURIComponent(input)))); }
    catch { setError('Encoding failed'); }
  }

  function decode() {
    setError('');
    try { setOutput(decodeURIComponent(escape(atob(input)))); }
    catch { setError('Invalid Base64'); }
  }

  return (
    <ConverterShell title="Base64 Encode / Decode" description="Encode text to Base64 or decode Base64 back to text." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="b64-in">Input</label>
          <textarea id="b64-in" placeholder="Enter text or Base64…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.actions}>
          <button className="btn-primary" onClick={encode}>Encode →</button>
          <button className="btn-secondary" onClick={decode}>← Decode</button>
          <button className="btn-secondary" onClick={() => { setInput(output); setOutput(''); }}>Use output as input</button>
        </div>
        {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error}</p>}
        {output && (
          <div className={styles.field}>
            <label>Output</label>
            <textarea className={styles.outputArea} readOnly value={output} />
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
