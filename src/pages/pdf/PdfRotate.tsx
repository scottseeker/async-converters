import { useRef, useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfRotate() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotations, setRotations] = useState<number[]>([]);
  const [globalRot, setGlobalRot] = useState(0);
  const [busy, setBusy] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [resultBytes, setResultBytes] = useState(0);

  async function loadFile(f: File) {
    setFile(f);
    setResultUrl('');
    const bytes = await f.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    const count = doc.getPageCount();
    setPageCount(count);
    setRotations(Array(count).fill(0));
    setGlobalRot(0);
  }

  function rotatePage(idx: number, delta: number) {
    setRotations(prev => {
      const next = [...prev];
      next[idx] = ((next[idx] + delta) % 360 + 360) % 360;
      return next;
    });
  }

  function applyGlobal(delta: number) {
    const next = ((globalRot + delta) % 360 + 360) % 360;
    setGlobalRot(next);
    setRotations(prev => prev.map(r => ((r + delta) % 360 + 360) % 360));
  }

  async function apply() {
    if (!file) return;
    setBusy(true);
    try {
      const srcBytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(srcBytes);
      const pages = doc.getPages();
      pages.forEach((page, i) => {
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + rotations[i]) % 360));
      });
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
      title="PDF Rotate"
      description="Rotate individual pages or all pages of a PDF — right in your browser."
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Rotate all pages:</span>
              <button className={styles.rotateBtn} onClick={() => applyGlobal(-90)}>↺ 90° CCW</button>
              <button className={styles.rotateBtn} onClick={() => applyGlobal(90)}>↻ 90° CW</button>
              <button className={styles.rotateBtn} onClick={() => applyGlobal(180)}>↕ 180°</button>
              {globalRot !== 0 && <span style={{ color: 'var(--accent)', fontSize: '0.78rem' }}>All: +{globalRot}°</span>}
            </div>

            <div className={styles.rotateGrid}>
              {rotations.map((rot, i) => (
                <div key={i} className={styles.rotateCard}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Page {i + 1}</span>
                  <div className={styles.rotateControls}>
                    <button className={styles.rotateBtn} onClick={() => rotatePage(i, -90)} title="90° CCW">↺</button>
                    <button className={styles.rotateBtn} onClick={() => rotatePage(i, 90)} title="90° CW">↻</button>
                  </div>
                  <span className={styles.rotateDeg}>{rot === 0 ? 'No change' : `+${rot}°`}</span>
                </div>
              ))}
            </div>

            <div className={styles.actions}>
              <button className="btn-primary" onClick={apply} disabled={busy}>
                {busy ? 'Applying…' : 'Apply Rotations'}
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
            <a href={resultUrl} download="rotated.pdf" style={{ marginLeft: 'auto', padding: '0.5rem 1.1rem', background: 'var(--accent)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              ⬇ Download rotated.pdf
            </a>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
