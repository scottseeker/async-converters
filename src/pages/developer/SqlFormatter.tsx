import { useState } from 'react';
import { format } from 'sql-formatter';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

type Dialect = 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'bigquery' | 'tsql';
const DIALECTS: Dialect[] = ['sql', 'mysql', 'postgresql', 'sqlite', 'bigquery', 'tsql'];

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState<Dialect>('sql');
  const [error, setError] = useState('');

  function formatSql() {
    try {
      setOutput(format(input, { language: dialect, tabWidth: 2, keywordCase: 'upper' }));
      setError('');
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <ConverterShell title="SQL Formatter" description="Format and beautify SQL queries with dialect-specific support." category="developer">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {DIALECTS.map(d => (
            <button key={d} style={dialect === d ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setDialect(d)}>{d}</button>
          ))}
        </div>
        <div className={styles.field}>
          <label>SQL</label>
          <textarea style={{ minHeight: 180, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} placeholder="SELECT * FROM users WHERE active=1 ORDER BY name" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        {error && <p style={{ color: '#e55', fontSize: '0.875rem' }}>{error}</p>}
        <div className={styles.actions}>
          <button onClick={formatSql}>Format</button>
          <button onClick={() => { setInput(''); setOutput(''); setError(''); }}>Clear</button>
        </div>
        {output && (
          <>
            <div className={styles.field}>
              <label>Formatted SQL</label>
              <textarea className={styles.outputArea} readOnly value={output} style={{ minHeight: 200, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} />
            </div>
            <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(output)}>Copy</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
