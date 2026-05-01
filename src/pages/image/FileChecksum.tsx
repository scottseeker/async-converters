import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

interface FileHash { name: string; size: number; md5?: string; sha1?: string; sha256?: string; }

export default function FileChecksum() {
  const [results, setResults] = useState<FileHash[]>([]);
  const [loading, setLoading] = useState(false);
  const [algos, setAlgos] = useState({ sha256: true, sha1: false });

  async function hash(buf: ArrayBuffer, algo: string): Promise<string> {
    const digest = await crypto.subtle.digest(algo, buf);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setLoading(true); setResults([]);
    const out: FileHash[] = await Promise.all(files.map(async f => {
      const ab = await f.arrayBuffer();
      const r: FileHash = { name: f.name, size: f.size };
      if (algos.sha256) r.sha256 = await hash(ab, 'SHA-256');
      if (algos.sha1) r.sha1 = await hash(ab, 'SHA-1');
      return r;
    }));
    setResults(out); setLoading(false);
  }

  function fmtSize(n: number) {
    if (n < 1024) return `${n} B`;
    if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 ** 2).toFixed(2)} MB`;
  }

  return (
    <ConverterShell title="File Checksum" description="Generate SHA-256 / SHA-1 checksums for files using the Web Crypto API." category="image">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {(['sha256', 'sha1'] as const).map(k => (
            <label key={k} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={algos[k]} onChange={e => setAlgos(a => ({ ...a, [k]: e.target.checked }))} />
              {k.toUpperCase()}
            </label>
          ))}
        </div>
        <div className={styles.field}><label>Select files</label><input type="file" multiple onChange={onFiles} /></div>
        {loading && <p>Computing hashes…</p>}
        {results.map((r, i) => (
          <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '1rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 700 }}>{r.name} <span style={{ fontWeight: 400, color: 'var(--muted)', fontSize: '0.85rem' }}>({fmtSize(r.size)})</span></p>
            {r.sha256 && (
              <div className={styles.field} style={{ marginBottom: '0.5rem' }}>
                <label>SHA-256</label>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', wordBreak: 'break-all', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span>{r.sha256}</span>
                  <button onClick={() => navigator.clipboard.writeText(r.sha256!)} style={{ flexShrink: 0 }}>Copy</button>
                </div>
              </div>
            )}
            {r.sha1 && (
              <div className={styles.field}>
                <label>SHA-1</label>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', wordBreak: 'break-all', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span>{r.sha1}</span>
                  <button onClick={() => navigator.clipboard.writeText(r.sha1!)} style={{ flexShrink: 0 }}>Copy</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </ConverterShell>
  );
}
