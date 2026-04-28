import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

function decodeJwt(token: string) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('Token must have 3 parts (header.payload.signature)');
  function decode(s: string) {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64.padEnd(b64.length + (4 - b64.length % 4) % 4, '=');
    return JSON.parse(decodeURIComponent(escape(atob(padded))));
  }
  return {
    header: decode(parts[0]),
    payload: decode(parts[1]),
    signature: parts[2],
  };
}

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<ReturnType<typeof decodeJwt> | null>(null);
  const [error, setError] = useState('');

  function decode() {
    setError('');
    setResult(null);
    try { setResult(decodeJwt(token)); }
    catch (e) { setError((e as Error).message); }
  }

  const expiry = result?.payload.exp
    ? new Date(result.payload.exp * 1000).toLocaleString()
    : null;

  const isExpired = result?.payload.exp
    ? Date.now() / 1000 > result.payload.exp
    : null;

  return (
    <ConverterShell title="JWT Decoder" description="Decode and inspect JSON Web Tokens without verifying the signature." category="developer">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="jwt-in">JWT Token</label>
          <textarea id="jwt-in" className={styles.codeArea} style={{ minHeight: 100 }} placeholder="Paste your JWT here…" value={token} onChange={e => setToken(e.target.value)} />
        </div>
        <div className={styles.actions}>
          <button className="btn-primary" onClick={decode}>Decode</button>
        </div>
        {error && <p className={styles.error}>⚠ {error}</p>}
        {result && (
          <>
            {expiry && (
              <p style={{ fontSize: '0.875rem', color: isExpired ? 'var(--error)' : 'var(--success)' }}>
                {isExpired ? '⚠ Token expired' : '✓ Token not expired'} — Expires: {expiry}
              </p>
            )}
            {(['header', 'payload'] as const).map(key => (
              <div key={key} className={styles.jwtSection}>
                <div className={styles.jwtTitle}>{key.toUpperCase()}</div>
                <pre className={styles.codeArea} style={{ minHeight: 'auto', border: 'none', padding: 0 }}>
                  {JSON.stringify(result[key], null, 2)}
                </pre>
              </div>
            ))}
            <div className={styles.jwtSection}>
              <div className={styles.jwtTitle}>SIGNATURE (not verified)</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', wordBreak: 'break-all', color: 'var(--text-secondary)' }}>{result.signature}</div>
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
