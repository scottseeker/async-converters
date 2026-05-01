import { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfMerge() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [resultBytes, setResultBytes] = useState(0);

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    setResultUrl('');
    setFiles(prev => [...prev, ...Array.from(incoming)]);
  }

  function remove(idx: number) {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setResultUrl('');
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    setFiles(prev => {
      const a = [...prev];
      [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]];
      return a;
    });
  }

  function moveDown(idx: number) {
    setFiles(prev => {
      if (idx >= prev.length - 1) return prev;
      const a = [...prev];
      [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]];
      return a;
    });
  }

  async function merge() {
    if (files.length < 2) return;
    setBusy(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const out = await merged.save();
      const blob = new Blob([out], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setResultBytes(out.length);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ConverterShell
      title="PDF Merge"
      description="Combine multiple PDF files into a single document — entirely in your browser."
      category="pdf"
    >
      <div className={styles.form}>
        <div
          className={styles.dropZone}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        >
          📁 Click or drag PDF files here (add as many as you need)
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple
            style={{ display: 'none' }}
            onChange={e => addFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <div className={styles.fileList}>
            {files.map((f, i) => (
              <div key={i} className={styles.fileItem}>
                <span className={styles.dragHandle}>☰</span>
                <span className={styles.fileName}>📄 {f.name}</span>
                <span className={styles.fileSize}>{fmtBytes(f.size)}</span>
                <button className={styles.removeBtn} title="Move up" onClick={() => moveUp(i)}>↑</button>
                <button className={styles.removeBtn} title="Move down" onClick={() => moveDown(i)}>↓</button>
                <button className={styles.removeBtn} title="Remove" onClick={() => remove(i)}>✕</button>
              </div>
            ))}
          </div>
        )}

        {files.length >= 2 && (
          <div className={styles.actions}>
            <button className="btn-primary" onClick={merge} disabled={busy}>
              {busy ? 'Merging…' : `Merge ${files.length} PDFs`}
            </button>
          </div>
        )}

        {resultUrl && (
          <div className={styles.resultInfo}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Output size</span>
              <span className={styles.statValue}>{fmtBytes(resultBytes)}</span>
            </div>
            <a
              href={resultUrl}
              download="merged.pdf"
              style={{ marginLeft: 'auto', padding: '0.5rem 1.1rem', background: 'var(--accent)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}
            >
              ⬇ Download merged.pdf
            </a>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
