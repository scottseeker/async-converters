import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

export default function KeywordDensity() {
  const [text, setText] = useState('');
  const [minLength, setMinLength] = useState(3);

  const words = text.toLowerCase().match(/\b[a-z']+\b/g) ?? [];
  const total = words.length;
  const freq: Record<string, number> = {};
  for (const w of words) {
    if (w.length >= minLength) freq[w] = (freq[w] ?? 0) + 1;
  }
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);

  return (
    <ConverterShell title="Keyword Density Checker" description="Analyze word frequency and density in any text or article." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="kd-in">Text</label>
          <textarea id="kd-in" style={{ minHeight: 180 }} placeholder="Paste your text or article here…" value={text} onChange={e => setText(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="kd-min">Minimum word length: {minLength}</label>
          <input id="kd-min" type="range" min={1} max={10} value={minLength} onChange={e => setMinLength(Number(e.target.value))} />
        </div>
        {total > 0 && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}><div className={styles.statNum}>{total}</div><div className={styles.statLabel}>Total words</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{sorted.length}</div><div className={styles.statLabel}>Unique keywords</div></div>
            </div>
            <div>
              {sorted.map(([word, count]) => {
                const pct = ((count / total) * 100).toFixed(2);
                return (
                  <div key={word} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.35rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                    <span style={{ width: 140, fontFamily: 'var(--font-mono)' }}>{word}</span>
                    <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 4, height: 8 }}>
                      <div style={{ width: `${Math.min(100, count / sorted[0][1] * 100)}%`, background: 'var(--accent)', height: 8, borderRadius: 4 }} />
                    </div>
                    <span style={{ width: 40, textAlign: 'right', color: 'var(--text-muted)' }}>{count}×</span>
                    <span style={{ width: 55, textAlign: 'right', color: 'var(--accent)', fontWeight: 600 }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
