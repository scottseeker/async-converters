import { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

interface SplitFile {
  name: string;
  url: string;
  bytes: number;
}

export default function PdfSplit() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<'all' | 'range'>('all');
  const [rangeInput, setRangeInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<SplitFile[]>([]);

  async function loadFile(f: File) {
    setFile(f);
    setResults([]);
    const bytes = await f.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setPageCount(doc.getPageCount());
  }

  /** Parse "1-3, 5, 7-9" → 0-based indices */
  function parseRanges(input: string, total: number): number[] {
    const indices = new Set<number>();
    const parts = input.split(',').map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      const match = part.match(/^(\d+)(?:-(\d+))?$/);
      if (!match) continue;
      const start = Math.max(1, parseInt(match[1]));
      const end = match[2] ? Math.min(total, parseInt(match[2])) : start;
      for (let i = start; i <= end; i++) indices.add(i - 1);
    }
    return Array.from(indices).sort((a, b) => a - b);
  }

  async function split() {
    if (!file) return;
    setBusy(true);
    setResults([]);
    try {
      const srcBytes = await file.arrayBuffer();
      const src = await PDFDocument.load(srcBytes);
      const total = src.getPageCount();

      if (mode === 'all') {
        const files: SplitFile[] = [];
        for (let i = 0; i < total; i++) {
          const single = await PDFDocument.create();
          const [page] = await single.copyPages(src, [i]);
          single.addPage(page);
          const out = await single.save();
          const blob = new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
          files.push({ name: `page-${i + 1}.pdf`, url: URL.createObjectURL(blob), bytes: out.length });
        }
        setResults(files);
      } else {
        const indices = parseRanges(rangeInput, total);
        if (indices.length === 0) return;
        const single = await PDFDocument.create();
        const pages = await single.copyPages(src, indices);
        pages.forEach(p => single.addPage(p));
        const out = await single.save();
        const blob = new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
        setResults([{ name: 'extracted.pdf', url: URL.createObjectURL(blob), bytes: out.length }]);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <ConverterShell
      title="PDF Split"
      description="Split a PDF into individual pages or extract a custom page range — all in your browser."
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
          <>
            <div className={styles.field}>
              <label>Split mode</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <input type="radio" name="mode" checked={mode === 'all'} onChange={() => setMode('all')} />
                  Extract every page separately
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <input type="radio" name="mode" checked={mode === 'range'} onChange={() => setMode('range')} />
                  Extract page range
                </label>
              </div>
            </div>

            {mode === 'range' && (
              <div className={styles.field}>
                <label htmlFor="range-input">Pages (e.g. 1-3, 5, 7-9)</label>
                <input
                  id="range-input"
                  type="text"
                  placeholder={`1-${pageCount}`}
                  value={rangeInput}
                  onChange={e => setRangeInput(e.target.value)}
                />
              </div>
            )}

            <div className={styles.actions}>
              <button className="btn-primary" onClick={split} disabled={busy || (mode === 'range' && !rangeInput.trim())}>
                {busy ? 'Splitting…' : 'Split PDF'}
              </button>
            </div>
          </>
        )}

        {results.length > 0 && (
          <div className={styles.fileList}>
            {results.map((r, i) => (
              <div key={i} className={styles.fileItem}>
                <span className={styles.fileName}>📄 {r.name}</span>
                <span className={styles.fileSize}>{fmtBytes(r.bytes)}</span>
                <a href={r.url} download={r.name} style={{ padding: '0.25rem 0.6rem', background: 'var(--accent)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 600, textDecoration: 'none', fontSize: '0.78rem' }}>
                  ⬇
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
