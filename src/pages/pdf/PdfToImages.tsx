import { useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';

// Use the bundled worker from pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface RenderedPage {
  dataUrl: string;
  pageNum: number;
}

export default function PdfToImages() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(2);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [pages, setPages] = useState<RenderedPage[]>([]);

  async function render(f: File) {
    setFile(f);
    setPages([]);
    setBusy(true);
    setProgress('Loading PDF…');
    try {
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const total = pdf.numPages;
      const rendered: RenderedPage[] = [];

      for (let i = 1; i <= total; i++) {
        setProgress(`Rendering page ${i} of ${total}…`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        rendered.push({ dataUrl: canvas.toDataURL('image/png'), pageNum: i });
      }

      setPages(rendered);
    } finally {
      setBusy(false);
      setProgress('');
    }
  }

  function downloadAll() {
    pages.forEach(p => {
      const a = document.createElement('a');
      a.href = p.dataUrl;
      a.download = `page-${p.pageNum}.png`;
      a.click();
    });
  }

  return (
    <ConverterShell
      title="PDF → Images"
      description="Render each PDF page as a PNG image — entirely in your browser using PDF.js."
      category="image"
    >
      <div className={styles.form}>
        <div
          className={styles.dropZone}
          onClick={() => !busy && inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f && !busy) render(f); }}
        >
          {file ? `✓ ${file.name} — click to change` : '📁 Click or drag a PDF here'}
          <input ref={inputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) render(f); }} />
        </div>

        <div className={styles.field}>
          <label htmlFor="scale-input">
            Render scale: {scale}× <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>(higher = sharper but slower)</span>
          </label>
          <input
            id="scale-input"
            type="range"
            min={1}
            max={4}
            step={0.5}
            value={scale}
            disabled={busy}
            onChange={e => setScale(Number(e.target.value))}
          />
        </div>

        {busy && (
          <p style={{ fontSize: '0.875rem', color: 'var(--accent)' }}>{progress}</p>
        )}

        {pages.length > 0 && (
          <>
            <div className={styles.actions}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{pages.length} pages rendered</span>
              <button className="btn-primary" onClick={downloadAll}>⬇ Download all PNGs</button>
            </div>
            <div className={styles.imageGrid}>
              {pages.map(p => (
                <div key={p.pageNum} className={styles.imageCard}>
                  <img src={p.dataUrl} alt={`Page ${p.pageNum}`} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Page {p.pageNum}</span>
                  <a href={p.dataUrl} download={`page-${p.pageNum}.png`}>⬇ Download</a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
