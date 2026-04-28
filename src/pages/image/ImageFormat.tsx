import { useRef, useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function ImageFormat() {
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState('image/webp');
  const [quality, setQuality] = useState(0.9);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function onFile(file: File) {
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      setOutput(canvas.toDataURL(format, quality));
    };
    img.src = url;
  }

  const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
  const baseName = fileName.replace(/\.[^.]+$/, '');

  return (
    <ConverterShell title="Image Format Converter" description="Convert images between PNG, JPEG, and WebP formats in your browser." category="image">
      <div className={styles.form}>
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
        <div
          className={styles.dropZone}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
        >
          {output ? '✓ Converted — click to change image' : '📁 Click or drag an image to convert'}
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        </div>
        {output && (
          <div>
            <img src={output} alt="Converted" className={styles.preview} style={{ maxHeight: 360 }} />
            <br />
            <a href={output} download={`${baseName || 'converted'}.${ext}`} style={{ display: 'inline-block', marginTop: '0.75rem', padding: '0.5rem 1.1rem', background: 'var(--accent)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 600, textDecoration: 'none' }}>
              ⬇ Download {ext.toUpperCase()}
            </a>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
