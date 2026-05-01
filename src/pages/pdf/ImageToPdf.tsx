import { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageToPdf() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [resultBytes, setResultBytes] = useState(0);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setResultUrl('');
    setFiles(prev => [...prev, ...Array.from(list)]);
  }

  function remove(idx: number) {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setResultUrl('');
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    setFiles(prev => { const a = [...prev]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a; });
  }

  function moveDown(idx: number) {
    setFiles(prev => {
      if (idx >= prev.length - 1) return prev;
      const a = [...prev]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a;
    });
  }

  async function convert() {
    if (files.length === 0) return;
    setBusy(true);
    try {
      const pdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        let img;

        if (file.type === 'image/jpeg') {
          img = await pdf.embedJpg(bytes);
        } else {
          // Rasterize non-JPEG via canvas → JPEG
          const bitmap = await createImageBitmap(file);
          const canvas = document.createElement('canvas');
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(bitmap, 0, 0);
          const jpegData = await new Promise<ArrayBuffer>(res => {
            canvas.toBlob(b => b!.arrayBuffer().then(res), 'image/jpeg', 0.92);
          });
          img = await pdf.embedJpg(jpegData);
        }

        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }

      const out = await pdf.save();
      const blob = new Blob([out], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setResultBytes(out.length);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ConverterShell
      title="Image → PDF"
      description="Convert one or more images (JPEG, PNG, WebP, etc.) into a single PDF — all in your browser."
      category="pdf"
    >
      <div className={styles.form}>
        <div
          className={styles.dropZone}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        >
          📁 Click or drag image files here (JPEG, PNG, WebP…)
          <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => addFiles(e.target.files)} />
        </div>

        {files.length > 0 && (
          <div className={styles.fileList}>
            {files.map((f, i) => (
              <div key={i} className={styles.fileItem}>
                <span className={styles.dragHandle}>🖼️</span>
                <span className={styles.fileName}>{f.name}</span>
                <span className={styles.fileSize}>{fmtBytes(f.size)}</span>
                <button className={styles.removeBtn} onClick={() => moveUp(i)} title="Move up">↑</button>
                <button className={styles.removeBtn} onClick={() => moveDown(i)} title="Move down">↓</button>
                <button className={styles.removeBtn} onClick={() => remove(i)} title="Remove">✕</button>
              </div>
            ))}
          </div>
        )}

        {files.length > 0 && (
          <div className={styles.actions}>
            <button className="btn-primary" onClick={convert} disabled={busy}>
              {busy ? 'Converting…' : `Convert ${files.length} image${files.length !== 1 ? 's' : ''} to PDF`}
            </button>
          </div>
        )}

        {resultUrl && (
          <div className={styles.resultInfo}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Output size</span>
              <span className={styles.statValue}>{fmtBytes(resultBytes)}</span>
            </div>
            <a href={resultUrl} download="images.pdf" style={{ marginLeft: 'auto', padding: '0.5rem 1.1rem', background: 'var(--accent)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              ⬇ Download images.pdf
            </a>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
