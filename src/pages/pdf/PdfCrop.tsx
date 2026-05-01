import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';
import { PDFDocument } from 'pdf-lib';

export default function PdfCrop() {
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState('');
  const [crop, setCrop] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const ab = await f.arrayBuffer(); setPdfBytes(ab); setFileName(f.name); setDownloadUrl(null); setStatus('');
    try {
      const pdf = await PDFDocument.load(ab);
      const page = pdf.getPage(0);
      const { width, height } = page.getSize();
      setPageSize({ width: Math.round(width), height: Math.round(height) });
    } catch { setStatus('Could not read PDF.'); }
  }

  async function applyCrop() {
    if (!pdfBytes) return;
    setStatus('Cropping…'); setDownloadUrl(null);
    try {
      const pdf = await PDFDocument.load(pdfBytes);
      pdf.getPages().forEach(page => {
        const { width, height } = page.getSize();
        const newX = crop.left;
        const newY = crop.bottom;
        const newW = width - crop.left - crop.right;
        const newH = height - crop.top - crop.bottom;
        if (newW <= 0 || newH <= 0) return;
        page.setCropBox(newX, newY, newW, newH);
      });
      const bytes = await pdf.save();
      setDownloadUrl(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
      setFileName(f => f.replace(/\.pdf$/i, '') + '_cropped.pdf');
      setStatus('Done!');
    } catch { setStatus('Failed to crop PDF.'); }
  }

  return (
    <ConverterShell title="PDF Crop" description="Crop all pages of a PDF by specifying margins to remove." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Select PDF</label><input type="file" accept="application/pdf" onChange={onFile} /></div>
        {pageSize.width > 0 && (
          <>
            <p style={{ color: 'var(--muted)', margin: 0 }}>Page size: {pageSize.width} × {pageSize.height} pt</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {(['top', 'right', 'bottom', 'left'] as const).map(k => (
                <div key={k} className={styles.field} style={{ flex: 1, minWidth: 80 }}>
                  <label style={{ textTransform: 'capitalize' }}>{k} (pt)</label>
                  <input type="number" min={0} max={500} value={crop[k]} onChange={e => setCrop(c => ({ ...c, [k]: Number(e.target.value) }))} />
                </div>
              ))}
            </div>
            <div className={styles.actions}><button onClick={applyCrop}>Apply Crop</button></div>
          </>
        )}
        {status && <p style={{ color: status === 'Done!' ? 'var(--success)' : status.startsWith('Failed') ? 'var(--error)' : 'var(--muted)' }}>{status}</p>}
        {downloadUrl && <div className={styles.actions}><a href={downloadUrl} download={fileName}><button>Download PDF</button></a></div>}
      </div>
    </ConverterShell>
  );
}
