import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';
import { PDFDocument } from 'pdf-lib';

export default function PdfScale() {
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState('');
  const [scale, setScale] = useState(100);
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const ab = await f.arrayBuffer(); setPdfBytes(ab); setFileName(f.name); setDownloadUrl(null); setStatus('');
    try {
      const pdf = await PDFDocument.load(ab);
      const p = pdf.getPage(0);
      setPageSize({ width: Math.round(p.getWidth()), height: Math.round(p.getHeight()) });
    } catch { setStatus('Could not read PDF.'); }
  }

  async function applyScale() {
    if (!pdfBytes) return;
    const factor = scale / 100;
    setStatus('Scaling…'); setDownloadUrl(null);
    try {
      const src = await PDFDocument.load(pdfBytes);
      const out = await PDFDocument.create();
      const pageCount = src.getPageCount();
      for (let i = 0; i < pageCount; i++) {
        const srcPage = src.getPage(i);
        const { width, height } = srcPage.getSize();
        const newW = width * factor;
        const newH = height * factor;
        const newPage = out.addPage([newW, newH]);
        const [embedded] = await out.embedPdf(src, [i]);
        newPage.drawPage(embedded, { x: 0, y: 0, width: newW, height: newH });
      }
      const bytes = await out.save();
      setDownloadUrl(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
      setFileName(f => f.replace(/\.pdf$/i, '') + `_${scale}pct.pdf`);
      setStatus(`Done! Scaled to ${scale}%.`);
    } catch { setStatus('Failed to scale PDF.'); }
  }

  const newW = pageSize.width ? Math.round(pageSize.width * scale / 100) : 0;
  const newH = pageSize.height ? Math.round(pageSize.height * scale / 100) : 0;

  return (
    <ConverterShell title="PDF Scale" description="Scale all pages of a PDF to a percentage of their original size." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Select PDF</label><input type="file" accept="application/pdf" onChange={onFile} /></div>
        {pageSize.width > 0 && (
          <>
            <p style={{ color: 'var(--muted)', margin: 0 }}>Original: {pageSize.width} × {pageSize.height} pt → New: {newW} × {newH} pt</p>
            <div className={styles.field}>
              <label>Scale: {scale}%</label>
              <input type="range" min={10} max={400} value={scale} onChange={e => setScale(Number(e.target.value))} />
              <input type="number" min={10} max={400} value={scale} onChange={e => setScale(Number(e.target.value))} style={{ width: 80, marginTop: '0.25rem' }} />
            </div>
            <div className={styles.actions}><button onClick={applyScale}>Apply Scale</button></div>
          </>
        )}
        {status && <p style={{ color: status.startsWith('Done') ? 'var(--success)' : status.startsWith('Failed') ? 'var(--error)' : 'var(--muted)' }}>{status}</p>}
        {downloadUrl && <div className={styles.actions}><a href={downloadUrl} download={fileName}><button>Download Scaled PDF</button></a></div>}
      </div>
    </ConverterShell>
  );
}
