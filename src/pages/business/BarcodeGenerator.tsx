import { useState, useEffect, useRef } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './business.module.css';

export default function BarcodeGenerator() {
  const [value, setValue] = useState('');
  const [format, setFormat] = useState('CODE128');
  const [error, setError] = useState('');
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value.trim() || !svgRef.current) { setError(''); return; }
    import('jsbarcode').then(({ default: JsBarcode }) => {
      try {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        JsBarcode(svg, value, { format, lineColor: '#000', width: 2, height: 80, displayValue: true });
        svgRef.current!.innerHTML = '';
        svgRef.current!.appendChild(svg);
        setError('');
      } catch (e) {
        setError(String(e));
        svgRef.current!.innerHTML = '';
      }
    });
  }, [value, format]);

  return (
    <ConverterShell title="Barcode Generator" description="Generate CODE128, EAN, UPC, and other barcodes from any value." category="finance">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 2, minWidth: 160 }}>
            <label htmlFor="bc-val">Value</label>
            <input id="bc-val" type="text" placeholder="123456789012" value={value} onChange={e => setValue(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="bc-fmt">Format</label>
            <select id="bc-fmt" value={format} onChange={e => setFormat(e.target.value)} style={{ width: '100%' }}>
              {['CODE128','EAN13','EAN8','UPC','CODE39','ITF14','MSI','pharmacode'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
        {error && <p style={{ color: '#e55', fontSize: '0.85rem' }}>{error}</p>}
        <div ref={svgRef} style={{ background: '#fff', padding: '1rem', borderRadius: 8, display: 'flex', justifyContent: 'center', minHeight: 100, border: '1px solid var(--border)' }} />
      </div>
    </ConverterShell>
  );
}
