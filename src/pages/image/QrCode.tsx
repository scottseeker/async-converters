import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function QrCode() {
  const [value, setValue] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  function download() {
    const svg = document.querySelector('#qr-output svg');
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'qrcode.svg'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ConverterShell title="QR Code Generator" description="Generate a QR code from any text or URL." category="image">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="qr-val">Text or URL</label>
          <input id="qr-val" type="text" placeholder="https://…" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Size ({size}px)</label>
            <input type="range" min={128} max={512} step={16} value={size} onChange={e => setSize(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Error Correction</label>
            <select value={level} onChange={e => setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}>
              <option value="L">L — Low (7%)</option>
              <option value="M">M — Medium (15%)</option>
              <option value="Q">Q — Quartile (25%)</option>
              <option value="H">H — High (30%)</option>
            </select>
          </div>
        </div>

        {value && (
          <div id="qr-output" className={styles.qrWrapper}>
            <QRCodeSVG value={value} size={size} level={level} />
          </div>
        )}

        {value && (
          <button className="btn-secondary" style={{ alignSelf: 'flex-start' }} onClick={download}>⬇ Download SVG</button>
        )}
      </div>
    </ConverterShell>
  );
}
