import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './social.module.css';

export default function CaptionLineBreak() {
  const [input, setInput] = useState('');

  // Instagram trims whitespace-only lines, so use a zero-width char trick
  const output = input.replace(/\n\n/g, '\n.\n');

  return (
    <ConverterShell title="Caption Line Break Formatter" description="Add Instagram-compatible line breaks to your captions using the dot trick." category="social">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="clb-in">Caption (use double Enter for paragraph breaks)</label>
          <textarea id="clb-in" style={{ minHeight: 180 }} placeholder={'First paragraph...\n\nSecond paragraph...'} value={input} onChange={e => setInput(e.target.value)} />
        </div>
        {input && (
          <>
            <div className={styles.field}>
              <label>Instagram-Ready Caption</label>
              <textarea className={styles.outputArea} readOnly value={output} />
            </div>
            <div className={styles.actions}>
              <button onClick={() => navigator.clipboard.writeText(output)}>Copy Caption</button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              The dot (.) is a common workaround for Instagram's line-break collapsing behavior.
            </p>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
