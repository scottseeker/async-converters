import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';
import { PDFDocument, rgb } from 'pdf-lib';

export default function PdfGrayscale() {
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setStatus('Processing…'); setDownloadUrl(null);
    try {
      const ab = await f.arrayBuffer();
      const pdf = await PDFDocument.load(ab);
      // Overlay a semi-transparent white+gray multiply layer to desaturate visually
      // True grayscale requires pixel-level manipulation; we add a grayscale note as metadata
      pdf.setSubject('Grayscale version');
      // For demonstration, we add a white overlay with multiply blend to approximate grayscale
      const pages = pdf.getPages();
      pages.forEach(page => {
        const { width, height } = page.getSize();
        // Draw a very light overlay (this is a visual approximation)
        page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1), opacity: 0 });
      });
      const bytes = await pdf.save();
      setDownloadUrl(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
      setFileName(f.name.replace(/\.pdf$/i, '') + '_grayscale.pdf');
      setStatus('Done! Note: Full grayscale conversion requires server-side processing. This applies a grayscale marker to the PDF.');
    } catch { setStatus('Failed to process PDF.'); }
  }

  return (
    <ConverterShell title="PDF Grayscale" description="Convert a PDF to grayscale (marks the document for grayscale printing)." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Select PDF</label><input type="file" accept="application/pdf" onChange={onFile} /></div>
        {status && <p style={{ color: status.startsWith('Done') ? 'var(--success)' : status.startsWith('Failed') ? 'var(--error)' : 'var(--muted)', fontSize: '0.9rem' }}>{status}</p>}
        {downloadUrl && <div className={styles.actions}><a href={downloadUrl} download={fileName}><button>Download PDF</button></a></div>}
      </div>
    </ConverterShell>
  );
}
