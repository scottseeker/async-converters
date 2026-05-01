import { useRef, useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

type Alignment = 'left' | 'center' | 'right';
type VerticalPos = 'top' | 'bottom';

export default function PdfPageNumbers() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [startNumber, setStartNumber] = useState(1);
  const [format, setFormat] = useState('Page {n} of {total}');
  const [fontSize, setFontSize] = useState(11);
  const [alignment, setAlignment] = useState<Alignment>('center');
  const [vertPos, setVertPos] = useState<VerticalPos>('bottom');
  const [busy, setBusy] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [resultBytes, setResultBytes] = useState(0);

  async function loadFile(f: File) {
    setFile(f);
    setResultUrl('');
    const bytes = await f.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setPageCount(doc.getPageCount());
  }

  async function apply() {
    if (!file) return;
    setBusy(true);
    try {
      const srcBytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(srcBytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const total = pages.length;
      const margin = 20;

      pages.forEach((page, i) => {
        const label = format
          .replace('{n}', String(i + startNumber))
          .replace('{total}', String(total + startNumber - 1));
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(label, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        let x: number;
        switch (alignment) {
          case 'left': x = margin; break;
          case 'right': x = width - textWidth - margin; break;
          default: x = (width - textWidth) / 2;
        }

        const y = vertPos === 'bottom' ? margin : height - textHeight - margin;

        page.drawText(label, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
      });

      const out = await doc.save();
      const blob = new Blob([out], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setResultBytes(out.length);
    } finally {
      setBusy(false);
    }
  }

  const preview = format.replace('{n}', String(startNumber)).replace('{total}', String(pageCount + startNumber - 1));

  return (
    <ConverterShell
      title="PDF Page Numbers"
      description="Add customizable page numbers to every page of your PDF."
      category="pdf"
    >
      <div className={styles.form}>
        <div
          className={styles.dropZone}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
        >
          {file ? `✓ ${file.name} (${pageCount} pages) — click to change` : '📁 Click or drag a PDF here'}
          <input ref={inputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
        </div>

        {file && (
          <div className={styles.watermarkSettings}>
            <div className={styles.field}>
              <label htmlFor="pn-format">Format <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>({'{n}'} = page, {'{total}'} = total)</span></label>
              <input id="pn-format" type="text" value={format} onChange={e => setFormat(e.target.value)} placeholder="Page {n} of {total}" />
              {pageCount > 0 && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Preview: "{preview}"</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="pn-start">Start numbering at</label>
              <input id="pn-start" type="number" min={0} value={startNumber} onChange={e => setStartNumber(Number(e.target.value))} />
            </div>

            <div className={styles.field}>
              <label htmlFor="pn-size">Font size ({fontSize}pt)</label>
              <input id="pn-size" type="range" min={6} max={24} step={1} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} />
            </div>

            <div className={styles.field}>
              <label htmlFor="pn-align">Alignment</label>
              <select id="pn-align" value={alignment} onChange={e => setAlignment(e.target.value as Alignment)}>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="pn-vert">Position</label>
              <select id="pn-vert" value={vertPos} onChange={e => setVertPos(e.target.value as VerticalPos)}>
                <option value="bottom">Bottom</option>
                <option value="top">Top</option>
              </select>
            </div>
          </div>
        )}

        {file && (
          <div className={styles.actions}>
            <button className="btn-primary" onClick={apply} disabled={busy}>
              {busy ? 'Adding…' : 'Add Page Numbers'}
            </button>
          </div>
        )}

        {resultUrl && (
          <div className={styles.resultInfo}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Output size</span>
              <span className={styles.statValue}>{fmtBytes(resultBytes)}</span>
            </div>
            <a href={resultUrl} download="numbered.pdf" style={{ marginLeft: 'auto', padding: '0.5rem 1.1rem', background: 'var(--accent)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              ⬇ Download numbered.pdf
            </a>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
