import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

function toSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-');
}

export default function TextToSlug() {
  const [input, setInput] = useState('');

  const slug = toSlug(input);

  return (
    <ConverterShell title="Text to Slug Converter" description="Convert any text into a clean, URL-safe slug for links and SEO." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="ts-in">Input Text</label>
          <input id="ts-in" type="text" placeholder="My Blog Post Title Here!" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        {input && (
          <>
            <div className={styles.field}>
              <label>Slug</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input readOnly value={slug} style={{ fontFamily: 'var(--font-mono)', flex: 1 }} />
                <button onClick={() => navigator.clipboard.writeText(slug)}>Copy</button>
              </div>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}><div className={styles.statNum}>{slug.length}</div><div className={styles.statLabel}>Characters</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{slug.split('-').filter(Boolean).length}</div><div className={styles.statLabel}>Words</div></div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preview: <code>https://example.com/{slug}</code></p>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
