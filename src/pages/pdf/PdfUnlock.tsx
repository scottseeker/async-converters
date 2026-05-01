import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';
import { PDFDocument } from 'pdf-lib';

export default function PdfUnlock() {
  const [status, setStatus] = useState('');
  const [password, setPassword] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setStatus('Processing…'); setDownloadUrl(null);
    try {
      const ab = await f.arrayBuffer();
      const pdf = await PDFDocument.load(ab);
      const bytes = await pdf.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setFileName(f.name.replace(/\.pdf$/i, '') + '_unlocked.pdf');
      setStatus('Done! Password removed from PDF.');
    } catch {
      setStatus('Failed to unlock PDF. Check the password.');
    }
  }

  return (
    <ConverterShell title="PDF Unlock" description="Remove password protection from a PDF file." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Password (if known)</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank if no password" /></div>
        <div className={styles.field}><label>Select PDF</label><input type="file" accept="application/pdf" onChange={onFile} /></div>
        {status && <p style={{ color: status.startsWith('Done') ? 'var(--success)' : status.startsWith('Failed') ? 'var(--error)' : 'var(--muted)' }}>{status}</p>}
        {downloadUrl && <div className={styles.actions}><a href={downloadUrl} download={fileName}><button>Download Unlocked PDF</button></a></div>}
      </div>
    </ConverterShell>
  );
}
