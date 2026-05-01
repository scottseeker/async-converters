import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export default function PdfHeaderFooter() {
  const [header, setHeader] = useState('');
  const [footer, setFooter] = useState('');
  const [pageNumbers, setPageNumbers] = useState(true);
  const [fontSize, setFontSize] = useState(10);
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setStatus('Processing…'); setDownloadUrl(null);
    try {
      const ab = await f.arrayBuffer();
      const pdf = await PDFDocument.load(ab);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const count = pages.length;
      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const margin = 20;
        const color = rgb(0.3, 0.3, 0.3);
        if (header) {
          const w = font.widthOfTextAtSize(header, fontSize);
          page.drawText(header, { x: (width - w) / 2, y: height - margin - fontSize, size: fontSize, font, color });
        }
        const footerText = footer + (pageNumbers ? (footer ? ' — ' : '') + `Page ${i + 1} of ${count}` : '');
        if (footerText) {
          const w = font.widthOfTextAtSize(footerText, fontSize);
          page.drawText(footerText, { x: (width - w) / 2, y: margin, size: fontSize, font, color });
        }
      });
      const bytes = await pdf.save();
      setDownloadUrl(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
      setFileName(f.name.replace(/\.pdf$/i, '') + '_hf.pdf');
      setStatus(`Done! Applied to ${count} pages.`);
    } catch { setStatus('Failed to add header/footer.'); }
  }

  return (
    <ConverterShell title="PDF Header & Footer" description="Add header, footer, and page numbers to a PDF." category="image">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}><label>Header text</label><input value={header} onChange={e => setHeader(e.target.value)} placeholder="My Document" /></div>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}><label>Footer text</label><input value={footer} onChange={e => setFooter(e.target.value)} placeholder="Confidential" /></div>
          <div className={styles.field} style={{ minWidth: 80 }}><label>Font size</label><input type="number" min={6} max={20} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} /></div>
        </div>
        <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={pageNumbers} onChange={e => setPageNumbers(e.target.checked)} /> Add page numbers
        </label>
        <div className={styles.field}><label>Select PDF</label><input type="file" accept="application/pdf" onChange={onFile} /></div>
        {status && <p style={{ color: status.startsWith('Done') ? 'var(--success)' : status.startsWith('Failed') ? 'var(--error)' : 'var(--muted)' }}>{status}</p>}
        {downloadUrl && <div className={styles.actions}><a href={downloadUrl} download={fileName}><button>Download PDF</button></a></div>}
      </div>
    </ConverterShell>
  );
}
