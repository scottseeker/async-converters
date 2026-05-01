import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

function stripHtml(html: string) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function HtmlStripper() {
  const [input, setInput] = useState('');
  const output = stripHtml(input);

  return (
    <ConverterShell title="HTML Tag Stripper" description="Remove all HTML tags from text and decode common HTML entities." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="hs-in">HTML Input</label>
          <textarea id="hs-in" style={{ minHeight: 180, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} placeholder="<p>Paste <strong>HTML</strong> here…</p>" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        {input && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}><div className={styles.statNum}>{input.length}</div><div className={styles.statLabel}>Input chars</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{output.length}</div><div className={styles.statLabel}>Output chars</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{input.match(/<[^>]+>/g)?.length ?? 0}</div><div className={styles.statLabel}>Tags removed</div></div>
            </div>
            <div className={styles.field}>
              <label>Plain Text</label>
              <textarea className={styles.outputArea} readOnly value={output} />
            </div>
            <div className={styles.actions}>
              <button onClick={() => navigator.clipboard.writeText(output)}>Copy Plain Text</button>
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
