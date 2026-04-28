import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

type Algo = 'SHA-1' | 'SHA-256' | 'SHA-512';
const ALGOS: Algo[] = ['SHA-1', 'SHA-256', 'SHA-512'];

async function hashText(text: string, algo: Algo): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<Algo, string>>({} as Record<Algo, string>);
  const [copied, setCopied] = useState('');

  async function generate() {
    const results = await Promise.all(ALGOS.map(a => hashText(input, a)));
    const map = {} as Record<Algo, string>;
    ALGOS.forEach((a, i) => { map[a] = results[i]; });
    setHashes(map);
  }

  function copy(text: string, algo: string) {
    navigator.clipboard.writeText(text);
    setCopied(algo);
    setTimeout(() => setCopied(''), 1500);
  }

  return (
    <ConverterShell title="Hash Generator" description="Generate SHA-1, SHA-256, and SHA-512 hashes using the browser's SubtleCrypto API." category="developer">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="hash-in">Input Text</label>
          <textarea id="hash-in" className={styles.codeArea} style={{ minHeight: 100 }} placeholder="Enter text to hash…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.actions}>
          <button className="btn-primary" onClick={generate}>Generate Hashes</button>
        </div>
        {Object.entries(hashes).length > 0 && (
          <div className={styles.hashGrid}>
            {ALGOS.map(a => (
              <div key={a} className={styles.hashCard}>
                <div className={styles.hashLabel}>{a}</div>
                <div className={styles.hashValue}>{hashes[a]}</div>
                <button
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--bg-code)', border: '1px solid var(--border)', borderRadius: 4, marginTop: '0.35rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                  onClick={() => copy(hashes[a], a)}
                >
                  {copied === a ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
