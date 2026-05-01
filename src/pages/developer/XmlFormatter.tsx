import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

function formatXml(xml: string): string {
  let formatted = '';
  let indent = 0;
  const lines = xml.replace(/>\s*</g, '>\n<').split('\n');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('</')) { indent--; }
    formatted += '  '.repeat(Math.max(0, indent)) + line + '\n';
    if (line.startsWith('<') && !line.startsWith('</') && !line.startsWith('<?') && !line.endsWith('/>') && !line.includes('</')) { indent++; }
  }
  return formatted.trim();
}

export default function XmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function format() {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'application/xml');
      const err = doc.querySelector('parsererror');
      if (err) { setError('Invalid XML: ' + err.textContent?.split('\n')[0]); return; }
      setError('');
      setOutput(formatXml(input));
    } catch (e) {
      setError(String(e));
    }
  }

  function minify() {
    setOutput(input.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim());
  }

  return (
    <ConverterShell title="XML Formatter" description="Format and minify XML documents with proper indentation." category="developer">
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Input XML</label>
          <textarea style={{ minHeight: 180, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} placeholder="<root><item>value</item></root>" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        {error && <p style={{ color: '#e55', fontSize: '0.875rem' }}>{error}</p>}
        <div className={styles.actions}>
          <button onClick={format}>Format</button>
          <button onClick={minify}>Minify</button>
          <button onClick={() => { setInput(''); setOutput(''); setError(''); }}>Clear</button>
        </div>
        {output && (
          <div className={styles.field}>
            <label>Output</label>
            <textarea className={styles.outputArea} readOnly value={output} style={{ minHeight: 200, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} />
          </div>
        )}
        {output && <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(output)}>Copy</button></div>}
      </div>
    </ConverterShell>
  );
}
