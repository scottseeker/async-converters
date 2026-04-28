import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

function encodeHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
          .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function decodeHtml(s: string) {
  const el = document.createElement('div');
  el.innerHTML = s;
  return el.textContent ?? '';
}

export default function HtmlEntitiesConverter() {
  const [input, setInput] = useState('');

  const encoded = input ? encodeHtml(input) : '';
  const decoded = input ? decodeHtml(input) : '';

  return (
    <ConverterShell title="HTML Entities" description="Encode/decode HTML special characters like &amp; &lt; &gt; &quot;." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="html-in">Input</label>
          <textarea id="html-in" placeholder="Enter text or HTML with entities…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        {input && (
          <>
            <div className={styles.field}>
              <label>HTML Encoded</label>
              <textarea className={styles.outputArea} readOnly value={encoded} />
            </div>
            <div className={styles.field}>
              <label>HTML Decoded</label>
              <textarea className={styles.outputArea} readOnly value={decoded} />
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
