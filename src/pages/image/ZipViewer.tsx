import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';
import JSZip from 'jszip';

interface FileEntry { name: string; size: number; dir: boolean; }

export default function ZipViewer() {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(''); setLoading(true); setEntries([]);
    try {
      const ab = await f.arrayBuffer();
      const zip = await JSZip.loadAsync(ab);
      const result: FileEntry[] = [];
      zip.forEach((path, file) => {
        result.push({ name: path, size: 0, dir: file.dir });
      });
      // Get sizes
      await Promise.all(result.map(async (r) => {
        if (!r.dir) {
          const data = await zip.file(r.name)?.async('uint8array');
          r.size = data?.length ?? 0;
        }
      }));
      setEntries(result.sort((a, b) => (a.dir === b.dir ? a.name.localeCompare(b.name) : a.dir ? -1 : 1)));
    } catch {
      setError('Failed to read ZIP file.');
    } finally {
      setLoading(false);
    }
  }

  function fmtSize(n: number) {
    if (n < 1024) return `${n} B`;
    if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 ** 2).toFixed(2)} MB`;
  }

  return (
    <ConverterShell title="ZIP Viewer" description="Inspect the contents of a ZIP file without extracting it." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Select ZIP file</label><input type="file" accept=".zip" onChange={onFile} /></div>
        {loading && <p>Loading…</p>}
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
        {entries.length > 0 && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}><div className={styles.statNum}>{entries.length}</div><div className={styles.statLabel}>Entries</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{entries.filter(e => !e.dir).length}</div><div className={styles.statLabel}>Files</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{entries.filter(e => e.dir).length}</div><div className={styles.statLabel}>Folders</div></div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', maxHeight: 400, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '6px 12px' }}>Name</th><th style={{ padding: '6px 12px' }}>Size</th>
                </tr></thead>
                <tbody>{entries.map((e, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'var(--surface-alt)' }}>
                    <td style={{ padding: '4px 12px' }}>{e.dir ? '📁 ' : '📄 '}{e.name}</td>
                    <td style={{ padding: '4px 12px', color: 'var(--muted)' }}>{e.dir ? '—' : fmtSize(e.size)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
