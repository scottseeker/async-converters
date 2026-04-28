import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import { contrastRatio, hexToRgb } from '../../converters/color/colorUtils';
import styles from './color.module.css';

export default function ColorContrast() {
  const [fg, setFg] = useState('#ffffff');
  const [bg, setBg] = useState('#2563eb');

  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);
  const ratio = fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : null;

  const checks = ratio !== null ? [
    { level: 'AA',  size: 'Normal text',  threshold: 4.5 },
    { level: 'AA',  size: 'Large text',   threshold: 3 },
    { level: 'AAA', size: 'Normal text',  threshold: 7 },
    { level: 'AAA', size: 'Large text',   threshold: 4.5 },
  ] : [];

  const badgeColor = ratio !== null
    ? ratio >= 7 ? '#16a34a' : ratio >= 4.5 ? '#2563eb' : ratio >= 3 ? '#d97706' : '#dc2626'
    : '#94a3b8';

  return (
    <ConverterShell title="Color Contrast Checker" description="Check WCAG AA and AAA color contrast ratios for accessibility." category="color">
      <div className={styles.form}>
        <div className={styles.contrastBoxes}>
          <div className={styles.field}>
            <label htmlFor="fg-color">Foreground color</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="color" value={fg} onChange={e => setFg(e.target.value)} style={{ width: 44, height: 38, padding: 2, cursor: 'pointer', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)' }} />
              <input id="fg-color" type="text" value={fg} onChange={e => setFg(e.target.value)} style={{ width: 110 }} />
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="bg-color">Background color</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="color" value={bg} onChange={e => setBg(e.target.value)} style={{ width: 44, height: 38, padding: 2, cursor: 'pointer', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)' }} />
              <input id="bg-color" type="text" value={bg} onChange={e => setBg(e.target.value)} style={{ width: 110 }} />
            </div>
          </div>
        </div>

        {fgRgb && bgRgb && (
          <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: bg, color: fg, border: '1.5px solid var(--border)', fontSize: '1.0625rem', fontWeight: 600 }}>
            Preview: The quick brown fox jumps over the lazy dog.
          </div>
        )}

        {ratio !== null && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className={styles.ratioBadge} style={{ background: badgeColor, color: '#fff' }}>
                {ratio}:1
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Contrast Ratio</span>
            </div>

            <table className={styles.passTable}>
              <thead>
                <tr><th>WCAG Level</th><th>Text Size</th><th>Min. Ratio</th><th>Result</th></tr>
              </thead>
              <tbody>
                {checks.map(c => (
                  <tr key={c.level + c.size}>
                    <td>{c.level}</td>
                    <td>{c.size}</td>
                    <td>{c.threshold}:1</td>
                    <td className={ratio >= c.threshold ? styles.pass : styles.fail}>
                      {ratio >= c.threshold ? '✓ Pass' : '✗ Fail'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
