import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

export default function FindReplace() {
  const [text, setText] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [error, setError] = useState('');

  function compute() {
    if (!find) return text;
    try {
      setError('');
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        return text.replace(new RegExp(find, flags), replace);
      }
      const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const flags = caseSensitive ? 'g' : 'gi';
      return text.replace(new RegExp(escaped, flags), replace);
    } catch (e) {
      setError(String(e));
      return text;
    }
  }

  const output = compute();
  const count = find && !error ? (text.match(
    useRegex
      ? new RegExp(find, caseSensitive ? 'g' : 'gi')
      : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), caseSensitive ? 'g' : 'gi')
  ) ?? []).length : 0;

  return (
    <ConverterShell title="Find & Replace" description="Find and replace text with optional regex and case-sensitivity support." category="text">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1 }}>
            <label htmlFor="fr-find">Find</label>
            <input id="fr-find" type="text" placeholder={useRegex ? 'Regex pattern…' : 'Search text…'} value={find} onChange={e => setFind(e.target.value)} style={{ fontFamily: useRegex ? 'var(--font-mono)' : undefined }} />
          </div>
          <div className={styles.field} style={{ flex: 1 }}>
            <label htmlFor="fr-replace">Replace with</label>
            <input id="fr-replace" type="text" placeholder="Replacement…" value={replace} onChange={e => setReplace(e.target.value)} />
          </div>
        </div>
        <div className={styles.actions}>
          <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" checked={useRegex} onChange={e => setUseRegex(e.target.checked)} /> Use regex
          </label>
          <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} /> Case sensitive
          </label>
          {count > 0 && <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: '0.875rem' }}>{count} match{count !== 1 ? 'es' : ''}</span>}
        </div>
        {error && <p style={{ color: 'var(--error, #e55)', fontSize: '0.8rem' }}>{error}</p>}
        <div className={styles.field}>
          <label htmlFor="fr-in">Input Text</label>
          <textarea id="fr-in" style={{ minHeight: 180 }} placeholder="Paste your text here…" value={text} onChange={e => setText(e.target.value)} />
        </div>
        {text && (
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
