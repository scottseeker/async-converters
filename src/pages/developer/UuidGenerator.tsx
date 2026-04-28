import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

function generateUUID(): string {
  return crypto.randomUUID();
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([generateUUID()]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState('');

  function generate() {
    setUuids(Array.from({ length: count }, generateUUID));
  }

  function copy(id: string) {
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(''), 1500);
  }

  function copyAll() {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied('all');
    setTimeout(() => setCopied(''), 1500);
  }

  return (
    <ConverterShell title="UUID Generator" description="Generate random UUID v4 identifiers in your browser." category="developer">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="field" style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="uuid-count">Count</label>
            <input id="uuid-count" type="number" min={1} max={100} value={count} onChange={e => setCount(Number(e.target.value))} style={{ width: 90 }} />
          </div>
          <button className="btn-primary" onClick={generate}>Generate</button>
          {uuids.length > 1 && (
            <button className="btn-secondary" onClick={copyAll}>{copied === 'all' ? '✓ Copied all' : 'Copy all'}</button>
          )}
        </div>

        <div className={styles.uuidList}>
          {uuids.map(id => (
            <div key={id} className={styles.uuidItem}>
              <span style={{ flex: 1 }}>{id}</span>
              <button
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'var(--bg-code)', border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0 }}
                onClick={() => copy(id)}
              >
                {copied === id ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </ConverterShell>
  );
}
