import { useRef, useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function ImageResize() {
  const [src, setSrc] = useState('');
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [keepRatio, setKeepRatio] = useState(true);
  const [quality, setQuality] = useState(0.9);
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState('image/jpeg');
  const inputRef = useRef<HTMLInputElement>(null);

  function onFile(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.width); setOrigH(img.height);
      setWidth(String(img.width)); setHeight(String(img.height));
      setSrc(url); setOutput('');
    };
    img.src = url;
  }

  function handleW(v: string) {
    setWidth(v);
    if (keepRatio && origW && origH) {
      const ratio = origH / origW;
      setHeight(String(Math.round(Number(v) * ratio)));
    }
  }

  function handleH(v: string) {
    setHeight(v);
    if (keepRatio && origW && origH) {
      const ratio = origW / origH;
      setWidth(String(Math.round(Number(v) * ratio)));
    }
  }

  function resize() {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Number(width) || img.width;
      canvas.height = Number(height) || img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setOutput(canvas.toDataURL(format, quality));
    };
    img.src = src;
  }

  const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';

  return (
    <ConverterShell title="Image Resize" description="Resize images directly in your browser — no upload required." category="image">
      <div className={styles.form}>
        <div
          className={styles.dropZone}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
        >
          {src ? '✓ Image loaded — click to change' : '📁 Click or drag an image here'}
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        </div>

        {src && (
          <>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Original: {origW} × {origH}px</p>
            <div className={styles.row}>
              <div className={styles.field}><label>Width (px)</label><input type="number" min={1} value={width} onChange={e => handleW(e.target.value)} /></div>
              <div className={styles.field}><label>Height (px)</label><input type="number" min={1} value={height} onChange={e => handleH(e.target.value)} /></div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 0 }}>
              <input type="checkbox" checked={keepRatio} onChange={e => setKeepRatio(e.target.checked)} /> Keep aspect ratio
            </label>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Output Format</label>
                <select value={format} onChange={e => setFormat(e.target.value)}>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
              {format !== 'image/png' && (
                <div className={styles.field}>
                  <label>Quality ({Math.round(quality * 100)}%)</label>
                  <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={e => setQuality(Number(e.target.value))} />
                </div>
              )}
            </div>
            <button className="btn-primary" onClick={resize}>Resize Image</button>
          </>
        )}

        {output && (
          <div>
            <img src={output} alt="Resized" className={styles.preview} style={{ maxHeight: 400 }} />
            <br />
            <a href={output} download={`resized.${ext}`} className="btn-primary" style={{ display: 'inline-block', marginTop: '0.75rem', padding: '0.5rem 1.1rem', background: 'var(--accent)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 600, textDecoration: 'none' }}>
              ⬇ Download
            </a>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
