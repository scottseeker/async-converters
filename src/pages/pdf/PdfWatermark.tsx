import { useRef, useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

type Position = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const POSITIONS: { id: Position; label: string }[] = [
  { id: 'center', label: 'Center' },
  { id: 'top-left', label: 'Top Left' },
  { id: 'top-right', label: 'Top Right' },
  { id: 'bottom-left', label: 'Bottom Left' },
  { id: 'bottom-right', label: 'Bottom Right' },
];

export default function PdfWatermark() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.25);
  const [fontSize, setFontSize] = useState(48);
  const [position, setPosition] = useState<Position>('center');
  const [diagonal, setDiagonal] = useState(true);
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
    if (!file || !text.trim()) return;
    setBusy(true);
    try {
      const srcBytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(srcBytes);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        let x = 0;
        let y = 0;
        const margin = 24;

        switch (position) {
          case 'center':
            x = (width - textWidth) / 2;
            y = (height - textHeight) / 2;
            break;
          case 'top-left':
            x = margin;
            y = height - textHeight - margin;
            break;
          case 'top-right':
            x = width - textWidth - margin;
            y = height - textHeight - margin;
            break;
          case 'bottom-left':
            x = margin;
            y = margin;
            break;
          case 'bottom-right':
            x = width - textWidth - margin;
            y = margin;
            break;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: diagonal ? { type: 'degrees' as unknown as import('pdf-lib').RotationTypes, angle: 45 } : undefined,
        });
      }

      const out = await doc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setResultBytes(out.length);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ConverterShell
      title="PDF Watermark"
      description="Add a text watermark to every page of a PDF — entirely client-side."
      category="image"
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
              <label htmlFor="wm-text">Watermark Text</label>
              <input id="wm-text" type="text" value={text} onChange={e => setText(e.target.value)} placeholder="CONFIDENTIAL" />
            </div>

            <div className={styles.field}>
              <label htmlFor="wm-font">Font Size ({fontSize}px)</label>
              <input id="wm-font" type="range" min={12} max={120} step={2} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} />
            </div>

            <div className={styles.field}>
              <label htmlFor="wm-opacity">Opacity ({Math.round(opacity * 100)}%)</label>
              <input id="wm-opacity" type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={e => setOpacity(Number(e.target.value))} />
            </div>

            <div className={styles.field}>
              <label htmlFor="wm-pos">Position</label>
              <select id="wm-pos" value={position} onChange={e => setPosition(e.target.value as Position)}>
                {POSITIONS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>

            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" checked={diagonal} onChange={e => setDiagonal(e.target.checked)} />
                Diagonal (45°)
              </label>
            </div>
          </div>
        )}

        {file && (
          <div className={styles.actions}>
            <button className="btn-primary" onClick={apply} disabled={busy || !text.trim()}>
              {busy ? 'Applying…' : 'Add Watermark'}
            </button>
          </div>
        )}

        {resultUrl && (
          <div className={styles.resultInfo}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Output size</span>
              <span className={styles.statValue}>{fmtBytes(resultBytes)}</span>
            </div>
            <a href={resultUrl} download="watermarked.pdf" style={{ marginLeft: 'auto', padding: '0.5rem 1.1rem', background: 'var(--accent)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              ⬇ Download watermarked.pdf
            </a>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
