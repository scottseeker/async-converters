import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import { hexToRgb, rgbToHex, rgbToHsl, rgbToHsv } from '../../converters/color/colorUtils';
import styles from './color.module.css';

export default function ColorFormat() {
  const [hex, setHex] = useState('#2563eb');
  const [pickerColor, setPickerColor] = useState('#2563eb');

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb) : null;
  const hsv = rgb ? rgbToHsv(rgb) : null;

  function handleHexChange(v: string) {
    setHex(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) setPickerColor(v);
  }

  function handlePicker(v: string) {
    setPickerColor(v);
    setHex(v.toUpperCase());
  }

  const formats = rgb && hsl && hsv ? [
    { label: 'HEX',  value: rgbToHex(rgb) },
    { label: 'RGB',  value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL',  value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'HSV',  value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
    { label: 'RGB (normalized)', value: `${(rgb.r/255).toFixed(3)}, ${(rgb.g/255).toFixed(3)}, ${(rgb.b/255).toFixed(3)}` },
  ] : [];

  return (
    <ConverterShell title="Color Format Converter" description="Convert colors between HEX, RGB, HSL, and HSV formats." category="color">
      <div className={styles.form}>
        <div className={styles.colorRow}>
          <input
            type="color"
            value={pickerColor}
            onChange={e => handlePicker(e.target.value)}
            style={{ width: 64, height: 64, padding: 2, border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'none' }}
            aria-label="Color picker"
          />
          <div className={styles.field} style={{ flex: 1 }}>
            <label htmlFor="hex-in">HEX Color</label>
            <input id="hex-in" type="text" placeholder="#2563eb" value={hex} onChange={e => handleHexChange(e.target.value)} />
          </div>
        </div>

        {formats.length > 0 && (
          <div className={styles.formats}>
            {formats.map(f => (
              <div key={f.label} className={styles.formatCard}>
                <div className={styles.formatLabel}>{f.label}</div>
                <div className={styles.formatValue}>{f.value}</div>
              </div>
            ))}
          </div>
        )}

        {!rgb && hex.length > 0 && (
          <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>Enter a valid 6-digit hex color (e.g. #2563eb)</p>
        )}
      </div>
    </ConverterShell>
  );
}
