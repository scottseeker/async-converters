import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';
import { PDFDocument } from 'pdf-lib';

export default function PdfReverse() {
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setStatus('Processing…'); setDownloadUrl(null);
    try {
      const ab = await f.arrayBuffer();
      const pdf = await PDFDocument.load(ab);
      const count = pdf.getPageCount();
      const newPdf = await PDFDocument.create();
      const indices = Array.from({ length: count }, (_, i) => count - 1 - i);
      const pages = await newPdf.copyPages(pdf, indices);
      pages.forEach(p => newPdf.addPage(p));
      const bytes = await newPdf.save();
      setDownloadUrl(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
      setFileName(f.name.replace(/\.pdf$/i, '') + '_reversed.pdf');
      setStatus(`Done! Reversed ${count} pages.`);
    } catch { setStatus('Failed to reverse PDF.'); }
  }

  return (
    <ConverterShell title="PDF Reverse" description="Reverse the page order of a PDF file." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Select PDF</label><input type="file" accept="application/pdf" onChange={onFile} /></div>
        {status && <p style={{ color: status.startsWith('Done') ? 'var(--success)' : status.startsWith('Failed') ? 'var(--error)' : 'var(--muted)' }}>{status}</p>}
        {downloadUrl && <div className={styles.actions}><a href={downloadUrl} download={fileName}><button>Download Reversed PDF</button></a></div>}
      </div>
    </ConverterShell>
  );
}
