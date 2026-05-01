import { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfReorder() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [order, setOrder] = useState<number[]>([]);  // 0-based original page indices
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [resultBytes, setResultBytes] = useState(0);

  async function loadFile(f: File) {
    setFile(f);
    setResultUrl('');
    const bytes = await f.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setOrder(Array.from({ length: doc.getPageCount() }, (_, i) => i));
  }

  function handleDragStart(idx: number) {
    setDragIdx(idx);
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setOrder(prev => {
      const next = [...prev];
      const [item] = next.splice(dragIdx, 1);
      next.splice(idx, 0, item);
      return next;
    });
    setDragIdx(idx);
  }

  function handleDragEnd() {
    setDragIdx(null);
  }

  async function save() {
    if (!file) return;
    setBusy(true);
    try {
      const srcBytes = await file.arrayBuffer();
      const src = await PDFDocument.load(srcBytes);
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, order);
      pages.forEach(p => out.addPage(p));
      const bytes = await out.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setResultBytes(bytes.length);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ConverterShell
      title="PDF Reorder Pages"
      description="Drag and drop to rearrange PDF pages, then download the reordered document."
      category="image"
    >
      <div className={styles.form}>
        <div
          className={styles.dropZone}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
        >
          {file ? `✓ ${file.name} (${order.length} pages) — click to change` : '📁 Click or drag a PDF here'}
          <input ref={inputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
        </div>

        {order.length > 0 && (
          <>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
              Drag pages to reorder them.
            </p>
            <div className={styles.pageGrid}>
              {order.map((origIdx, pos) => (
                <div
                  key={pos}
                  className={`${styles.pageCard} ${dragIdx === pos ? styles.pageCardDragging : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(pos)}
                  onDragOver={e => handleDragOver(e, pos)}
                  onDragEnd={handleDragEnd}
                >
                  <span style={{ fontSize: '1.5rem' }}>📄</span>
                  <span className={styles.pageNum}>Page {origIdx + 1}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>pos {pos + 1}</span>
                </div>
              ))}
            </div>

            <div className={styles.actions}>
              <button
                style={{ background: 'var(--bg-code)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.9rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}
                onClick={() => { setOrder(Array.from({ length: order.length }, (_, i) => i)); setResultUrl(''); }}
              >
                Reset
              </button>
              <button className="btn-primary" onClick={save} disabled={busy}>
                {busy ? 'Saving…' : 'Save Reordered PDF'}
              </button>
            </div>
          </>
        )}

        {resultUrl && (
          <div className={styles.resultInfo}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Output size</span>
              <span className={styles.statValue}>{fmtBytes(resultBytes)}</span>
            </div>
            <a href={resultUrl} download="reordered.pdf" style={{ marginLeft: 'auto', padding: '0.5rem 1.1rem', background: 'var(--accent)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              ⬇ Download reordered.pdf
            </a>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
