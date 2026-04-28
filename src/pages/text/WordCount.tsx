import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

function readingTime(words: number) {
  const mins = Math.ceil(words / 200);
  return mins === 1 ? '~1 min' : `~${mins} mins`;
}

export default function WordCount() {
  const [text, setText] = useState('');

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lines = text === '' ? 0 : text.split('\n').length;
  const sentences = (text.match(/[.!?]+/g) ?? []).length;
  const paragraphs = text.trim() === '' ? 0 : text.trim().split(/\n\s*\n/).length;

  return (
    <ConverterShell title="Word & Character Count" description="Count words, characters, lines, sentences, and estimate reading time." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="wc-in">Text</label>
          <textarea id="wc-in" style={{ minHeight: 200 }} placeholder="Paste or type your text here…" value={text} onChange={e => setText(e.target.value)} />
        </div>
        <div className={styles.stats}>
          {[
            { num: words,         label: 'Words' },
            { num: chars,         label: 'Characters' },
            { num: charsNoSpaces, label: 'Chars (no spaces)' },
            { num: lines,         label: 'Lines' },
            { num: sentences,     label: 'Sentences' },
            { num: paragraphs,    label: 'Paragraphs' },
            { num: readingTime(words), label: 'Reading Time' },
          ].map(s => (
            <div key={s.label} className={styles.stat}>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </ConverterShell>
  );
}
