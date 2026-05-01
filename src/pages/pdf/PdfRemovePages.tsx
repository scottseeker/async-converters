import { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfRemovePages() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [resultBytes, setResultBytes] = useState(0);

  async function loadFile(f: File) {
    setFile(f);
    setResultUrl('');
    setSelected(new Set());
    const bytes = await f.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setPageCount(doc.getPageCount());
  }

  function togglePage(idx: number) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
    setResultUrl('');
  }

  async function remove() {
    if (!file || selected.size === 0) return;
    if (selected.size >= pageCount) {
      alert('Cannot remove all pages.');
      return;
    }
    setBusy(true);
    try {
      const srcBytes = await file.arrayBuffer();
      const src = await PDFDocument.load(srcBytes);
      const keepIndices = Array.from({ length: pageCount }, (_, i) => i).filter(i => !selected.has(i));
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, keepIndices);
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
      title="PDF Remove Pages"
      description="Select pages to delete from a PDF, then download the trimmed document."
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

        {file && pageCount > 0 && (
          <>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
              Click pages to mark them for removal. Selected pages will be highlighted in red.
            </p>
            <div className={styles.pageGrid}>
              {Array.from({ length: pageCount }, (_, i) => (
                <div
                  key={i}
                  className={styles.pageCard}
                  onClick={() => togglePage(i)}
                  style={selected.has(i) ? { borderColor: '#ef4444', background: '#fef2f2', color: '#ef4444' } : undefined}
                >
                  <span style={{ fontSize: '1.5rem' }}>{selected.has(i) ? '🗑️' : '📄'}</span>
                  <span className={styles.pageNum}>Page {i + 1}</span>
                </div>
              ))}
            </div>

            {selected.size > 0 && (
              <div className={styles.actions}>
                <span style={{ fontSize: '0.875rem', color: '#ef4444' }}>
                  {selected.size} page{selected.size !== 1 ? 's' : ''} marked for removal
                </span>
                <button className="btn-primary" onClick={remove} disabled={busy} style={{ background: '#ef4444' }}>
                  {busy ? 'Removing…' : `Remove ${selected.size} page${selected.size !== 1 ? 's' : ''}`}
                </button>
              </div>
            )}
          </>
        )}

        {resultUrl && (
          <div className={styles.resultInfo}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Output size</span>
              <span className={styles.statValue}>{fmtBytes(resultBytes)}</span>
            </div>
            <a href={resultUrl} download="trimmed.pdf" style={{ marginLeft: 'auto', padding: '0.5rem 1.1rem', background: 'var(--accent)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              ⬇ Download trimmed.pdf
            </a>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
