import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';
import { PDFDocument } from 'pdf-lib';

interface Meta { title: string; author: string; subject: string; keywords: string; creator: string; }

export default function PdfMetadata() {
  const [existing, setExisting] = useState<Partial<Meta>>({});
  const [meta, setMeta] = useState<Meta>({ title: '', author: '', subject: '', keywords: '', creator: '' });
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const ab = await f.arrayBuffer();
    setPdfBytes(ab); setFileName(f.name); setDownloadUrl(null);
    try {
      const pdf = await PDFDocument.load(ab);
      const ex = { title: pdf.getTitle() ?? '', author: pdf.getAuthor() ?? '', subject: pdf.getSubject() ?? '', keywords: pdf.getKeywords() ?? '', creator: pdf.getCreator() ?? '' };
      setExisting(ex); setMeta(ex);
    } catch { setStatus('Could not read existing metadata.'); }
  }

  async function save() {
    if (!pdfBytes) return;
    setStatus('Saving…');
    try {
      const pdf = await PDFDocument.load(pdfBytes);
      if (meta.title) pdf.setTitle(meta.title);
      if (meta.author) pdf.setAuthor(meta.author);
      if (meta.subject) pdf.setSubject(meta.subject);
      if (meta.keywords) pdf.setKeywords([meta.keywords]);
      if (meta.creator) pdf.setCreator(meta.creator);
      const bytes = await pdf.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setStatus('Done!');
    } catch { setStatus('Failed to save metadata.'); }
  }

  const fields = ['title', 'author', 'subject', 'keywords', 'creator'] as const;

  return (
    <ConverterShell title="PDF Metadata" description="View and edit PDF metadata: title, author, subject, keywords." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Select PDF</label><input type="file" accept="application/pdf" onChange={onFile} /></div>
        {pdfBytes && (
          <>
            {fields.map(k => (
              <div key={k} className={styles.field}>
                <label style={{ textTransform: 'capitalize' }}>{k} {existing[k] ? <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(was: {existing[k]})</span> : null}</label>
                <input value={meta[k]} onChange={e => setMeta(m => ({ ...m, [k]: e.target.value }))} />
              </div>
            ))}
            <div className={styles.actions}><button onClick={save}>Save Metadata</button></div>
          </>
        )}
        {status && <p style={{ color: status === 'Done!' ? 'var(--success)' : status.includes('Failed') ? 'var(--error)' : 'var(--muted)' }}>{status}</p>}
        {downloadUrl && <div className={styles.actions}><a href={downloadUrl} download={fileName.replace(/\.pdf$/i, '') + '_meta.pdf'}><button>Download PDF</button></a></div>}
      </div>
    </ConverterShell>
  );
}
