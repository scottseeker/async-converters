import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

function diffLines(a: string, b: string) {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const result: { type: 'same' | 'removed' | 'added'; line: string }[] = [];

  const m = aLines.length, n = bLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) {
    if (aLines[i] === bLines[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
    else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
  }

  let i = 0, j = 0;
  while (i < m || j < n) {
    if (i < m && j < n && aLines[i] === bLines[j]) {
      result.push({ type: 'same', line: aLines[i] }); i++; j++;
    } else if (j < n && (i >= m || dp[i][j + 1] >= dp[i + 1][j])) {
      result.push({ type: 'added', line: bLines[j] }); j++;
    } else {
      result.push({ type: 'removed', line: aLines[i] }); i++;
    }
  }
  return result;
}

export default function DiffChecker() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [diff, setDiff] = useState<ReturnType<typeof diffLines>>([]);

  function check() { setDiff(diffLines(a, b)); }

  const added = diff.filter(l => l.type === 'added').length;
  const removed = diff.filter(l => l.type === 'removed').length;

  return (
    <ConverterShell title="Diff Checker" description="Compare two text blocks line by line and highlight the differences." category="developer">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className={styles.field} style={{ flex: 1 }}>
            <label>Original</label>
            <textarea style={{ minHeight: 160, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} value={a} onChange={e => setA(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1 }}>
            <label>Modified</label>
            <textarea style={{ minHeight: 160, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} value={b} onChange={e => setB(e.target.value)} />
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={check}>Compare</button>
          <button onClick={() => { setA(''); setB(''); setDiff([]); }}>Clear</button>
        </div>
        {diff.length > 0 && (
          <>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span style={{ color: '#2ecc71' }}>+{added} added</span> &nbsp; <span style={{ color: '#e74c3c' }}>-{removed} removed</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              {diff.map((l, i) => (
                <div key={i} style={{
                  padding: '2px 8px',
                  background: l.type === 'added' ? '#2ecc7120' : l.type === 'removed' ? '#e74c3c20' : 'transparent',
                  color: l.type === 'added' ? '#2ecc71' : l.type === 'removed' ? '#e74c3c' : 'var(--text)',
                }}>
                  {l.type === 'added' ? '+ ' : l.type === 'removed' ? '- ' : '  '}{l.line}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
