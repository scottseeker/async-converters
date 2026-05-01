import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function ExifRemover() {
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setStatus('Processing…'); setDownloadUrl(null); setFileName('');
    try {
      const ab = await f.arrayBuffer();
      const clean = removeExif(new Uint8Array(ab));
      const blob = new Blob([clean.buffer as ArrayBuffer], { type: 'image/jpeg' });
      setDownloadUrl(URL.createObjectURL(blob));
      setFileName(f.name.replace(/\.[^.]+$/, '') + '_clean.jpg');
      setStatus(`Done! Original: ${fmtSize(f.size)} → Clean: ${fmtSize(blob.size)}`);
    } catch {
      setStatus('Failed to strip EXIF. Only JPEG files are supported.');
    }
  }

  // Strips EXIF (APP1) markers from JPEG
  function removeExif(data: Uint8Array): Uint8Array {
    if (data[0] !== 0xFF || data[1] !== 0xD8) throw new Error('Not a JPEG');
    const out: number[] = [0xFF, 0xD8];
    let i = 2;
    while (i < data.length) {
      if (data[i] !== 0xFF) { out.push(data[i++]); continue; }
      while (i < data.length && data[i] === 0xFF) i++;
      const marker = data[i++];
      if (marker === 0xD9) { out.push(0xFF, 0xD9); break; }
      if (marker === 0xDA) { out.push(0xFF, 0xDA); out.push(...data.slice(i)); break; }
      const len = (data[i] << 8) | data[i + 1];
      // APP1 (EXIF) = 0xE1, APP2-APPF = 0xE2-0xEF — skip
      if (marker >= 0xE1 && marker <= 0xEF) { i += len; continue; }
      out.push(0xFF, marker, ...data.slice(i, i + len));
      i += len;
    }
    return new Uint8Array(out);
  }

  function fmtSize(n: number) {
    if (n < 1024) return `${n} B`;
    if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 ** 2).toFixed(2)} MB`;
  }

  return (
    <ConverterShell title="EXIF Remover" description="Strip EXIF metadata from JPEG photos to protect your privacy." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Select JPEG image</label><input type="file" accept="image/jpeg" onChange={onFile} /></div>
        {status && <p style={{ color: status.startsWith('Done') ? 'var(--success)' : status.startsWith('Failed') ? 'var(--error)' : 'var(--muted)' }}>{status}</p>}
        {downloadUrl && (
          <div className={styles.actions}>
            <a href={downloadUrl} download={fileName}><button>Download Clean Image</button></a>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
