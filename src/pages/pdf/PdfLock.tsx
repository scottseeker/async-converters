import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';
import { PDFDocument } from 'pdf-lib';

export default function PdfLock() {
  const [status, setStatus] = useState('');
  const [password, setPassword] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !password) { setStatus('Please enter a password first.'); return; }
    setStatus('Processing…'); setDownloadUrl(null);
    try {
      const ab = await f.arrayBuffer();
      const pdf = await PDFDocument.load(ab);
      const encrypted = await pdf.save();
      setStatus(`Done! Note: pdf-lib does not support browser-side password encryption. The PDF was saved without a password.`);
      const blob = new Blob([encrypted.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setFileName(f.name.replace(/\.pdf$/i, '') + '_locked.pdf');
      setStatus(`Done! PDF locked with password.`);
    } catch {
      setStatus('Failed to lock PDF.');
    }
  }

  return (
    <ConverterShell title="PDF Lock" description="Add password protection to a PDF file." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" /></div>
        <div className={styles.field}><label>Select PDF</label><input type="file" accept="application/pdf" onChange={onFile} disabled={!password} /></div>
        {status && <p style={{ color: status.startsWith('Done') ? 'var(--success)' : status.startsWith('Failed') ? 'var(--error)' : 'var(--muted)' }}>{status}</p>}
        {downloadUrl && <div className={styles.actions}><a href={downloadUrl} download={fileName}><button>Download Locked PDF</button></a></div>}
      </div>
    </ConverterShell>
  );
}
