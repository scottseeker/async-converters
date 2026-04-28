import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

export default function UrlEncodeConverter() {
  const [input, setInput] = useState('');

  const encoded = input ? encodeURIComponent(input) : '';
  const decoded = (() => {
    if (!input) return '';
    try { return decodeURIComponent(input); }
    catch { return 'Invalid URL encoding'; }
  })();

  return (
    <ConverterShell title="URL Encode / Decode" description="Encode text to URL-safe percent-encoding or decode it back." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="url-in">Input</label>
          <textarea id="url-in" placeholder="Enter text or URL-encoded string…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        {input && (
          <>
            <div className={styles.field}>
              <label>URL Encoded</label>
              <textarea className={styles.outputArea} readOnly value={encoded} />
            </div>
            <div className={styles.field}>
              <label>URL Decoded</label>
              <textarea className={styles.outputArea} readOnly value={decoded} />
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
