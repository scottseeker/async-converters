import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

// Full-width Unicode characters (A → Ａ etc.)
function toWide(text: string) {
  return text.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 0x21 && code <= 0x7E) return String.fromCharCode(code + 0xFEE0);
    if (code === 0x20) return '\u3000'; // ideographic space
    return c;
  }).join('');
}

export default function WideText() {
  const [input, setInput] = useState('');
  const output = toWide(input);

  return (
    <ConverterShell title="Wide Text Generator" description="Convert text to full-width Unicode characters (vaporwave / aesthetic style)." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="wt-in">Input Text</label>
          <input id="wt-in" type="text" placeholder="Type something…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        {input && (
          <>
            <div className={styles.field}>
              <label>Ｗｉｄｅ Ｔｅｘｔ</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input readOnly value={output} style={{ flex: 1, fontSize: '1rem', letterSpacing: '0.05em' }} />
                <button onClick={() => navigator.clipboard.writeText(output)}>Copy</button>
              </div>
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
