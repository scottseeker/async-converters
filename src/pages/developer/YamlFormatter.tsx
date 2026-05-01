import { useState } from 'react';
import * as yaml from 'js-yaml';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

export default function YamlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function formatYaml() {
    try {
      const parsed = yaml.load(input);
      setOutput(yaml.dump(parsed, { indent: 2, lineWidth: 80, noRefs: true }));
      setError('');
    } catch (e) {
      setError(String(e));
    }
  }

  function toJson() {
    try {
      const parsed = yaml.load(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError(String(e));
    }
  }

  function fromJson() {
    try {
      const parsed = JSON.parse(input);
      setOutput(yaml.dump(parsed, { indent: 2, noRefs: true }));
      setError('');
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <ConverterShell title="YAML Formatter" description="Format YAML, convert YAML ↔ JSON, and validate syntax." category="developer">
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Input</label>
          <textarea style={{ minHeight: 180, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} placeholder="name: example&#10;version: 1.0" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        {error && <p style={{ color: '#e55', fontSize: '0.875rem' }}>{error}</p>}
        <div className={styles.actions}>
          <button onClick={formatYaml}>Format YAML</button>
          <button onClick={toJson}>YAML → JSON</button>
          <button onClick={fromJson}>JSON → YAML</button>
          <button onClick={() => { setInput(''); setOutput(''); setError(''); }}>Clear</button>
        </div>
        {output && (
          <>
            <div className={styles.field}>
              <label>Output</label>
              <textarea className={styles.outputArea} readOnly value={output} style={{ minHeight: 200, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} />
            </div>
            <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(output)}>Copy</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
