import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

function diff(a: string, b: string) {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const result: { type: 'same' | 'add' | 'remove'; text: string }[] = [];
  const maxLen = Math.max(aLines.length, bLines.length);
  for (let i = 0; i < maxLen; i++) {
    const aLine = aLines[i] ?? '';
    const bLine = bLines[i] ?? '';
    if (aLine === bLine) result.push({ type: 'same', text: aLine });
    else {
      if (aLines[i] !== undefined) result.push({ type: 'remove', text: aLine });
      if (bLines[i] !== undefined) result.push({ type: 'add', text: bLine });
    }
  }
  return result;
}

export default function TextDiff() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');

  const diffResult = left || right ? diff(left, right) : null;
  const added = diffResult?.filter(d => d.type === 'add').length ?? 0;
  const removed = diffResult?.filter(d => d.type === 'remove').length ?? 0;

  return (
    <ConverterShell title="Text Diff Checker" description="Compare two blocks of text and highlight the differences line by line." category="text">
      <div className={styles.form}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.field}>
            <label htmlFor="td-left">Original</label>
            <textarea id="td-left" style={{ minHeight: 200 }} placeholder="Original text…" value={left} onChange={e => setLeft(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label htmlFor="td-right">Modified</label>
            <textarea id="td-right" style={{ minHeight: 200 }} placeholder="Modified text…" value={right} onChange={e => setRight(e.target.value)} />
          </div>
        </div>
        {diffResult && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}><div className={styles.statNum} style={{ color: 'var(--success, #22c55e)' }}>+{added}</div><div className={styles.statLabel}>Added</div></div>
              <div className={styles.stat}><div className={styles.statNum} style={{ color: 'var(--error, #ef4444)' }}>-{removed}</div><div className={styles.statLabel}>Removed</div></div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', background: 'var(--bg-code)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', overflowX: 'auto' }}>
              {diffResult.map((d, i) => (
                <div key={i} style={{
                  background: d.type === 'add' ? 'rgba(34,197,94,0.12)' : d.type === 'remove' ? 'rgba(239,68,68,0.12)' : 'transparent',
                  color: d.type === 'add' ? 'var(--success,#22c55e)' : d.type === 'remove' ? 'var(--error,#ef4444)' : 'var(--text-secondary)',
                  padding: '0.1rem 0.5rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}>
                  {d.type === 'add' ? '+ ' : d.type === 'remove' ? '- ' : '  '}{d.text}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
