import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';
import * as exifr from 'exifr';

export default function ExifViewer() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(''); setData(null);
    setPreview(URL.createObjectURL(f));
    try {
      const result = await exifr.parse(f, true);
      if (!result || Object.keys(result).length === 0) { setData({}); return; }
      setData(result);
    } catch {
      setError('Could not read EXIF data from this file.');
    }
  }

  function fmt(val: unknown): string {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'number') return isNaN(val) ? '—' : String(Number(val.toFixed(6)));
    if (val instanceof Date) return val.toLocaleString();
    if (ArrayBuffer.isView(val)) return `[${Array.from(val as Uint8Array).slice(0, 8).join(', ')}${(val as Uint8Array).length > 8 ? '…' : ''}]`;
    return String(val);
  }

  return (
    <ConverterShell title="EXIF Viewer" description="Read EXIF metadata from photos: camera, location, settings and more." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Select image</label><input type="file" accept="image/jpeg,image/tiff,image/heic,image/webp" onChange={onFile} /></div>
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
        {preview && <img src={preview} alt="preview" style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 10, objectFit: 'contain' }} />}
        {data && Object.keys(data).length === 0 && <p style={{ color: 'var(--muted)' }}>No EXIF data found in this image.</p>}
        {data && Object.keys(data).length > 0 && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', maxHeight: 400, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ borderBottom: '1px solid var(--border)' }}><th style={{ padding: '6px 12px', textAlign: 'left' }}>Tag</th><th style={{ padding: '6px 12px', textAlign: 'left' }}>Value</th></tr></thead>
              <tbody>{Object.entries(data).map(([k, v], i) => (
                <tr key={k} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'var(--surface-alt)' }}>
                  <td style={{ padding: '4px 12px', fontWeight: 600 }}>{k}</td>
                  <td style={{ padding: '4px 12px', color: 'var(--muted)', wordBreak: 'break-all' }}>{fmt(v)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
