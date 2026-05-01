import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './social.module.css';

const LIMITS = { Twitter: 280, 'X (old)': 280, LinkedIn: 3000, Instagram: 2200, Facebook: 63206 };

export default function TweetCounter() {
  const [text, setText] = useState('');
  const [platform, setPlatform] = useState<keyof typeof LIMITS>('Twitter');

  const limit = LIMITS[platform];
  const used = text.length;
  const remaining = limit - used;
  const pct = Math.min(100, (used / limit) * 100);

  return (
    <ConverterShell title="Tweet / Post Character Counter" description="Count characters for Twitter, LinkedIn, Instagram and other platforms." category="social">
      <div className={styles.form}>
        <div className={styles.actions}>
          {(Object.keys(LIMITS) as (keyof typeof LIMITS)[]).map(p => (
            <button key={p} style={platform === p ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setPlatform(p)}>{p}</button>
          ))}
        </div>
        <div className={styles.field}>
          <label htmlFor="tc-in">Post text</label>
          <textarea id="tc-in" style={{ minHeight: 180 }} placeholder={`Write your ${platform} post here…`} value={text} onChange={e => setText(e.target.value)} />
        </div>
        <div style={{ background: 'var(--bg-card)', borderRadius: 6, height: 8, overflow: 'hidden', marginBottom: '0.5rem' }}>
          <div style={{ width: `${pct}%`, background: remaining < 20 ? '#e55' : 'var(--accent)', height: '100%', transition: 'width 0.2s' }} />
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}><div className={styles.statNum}>{used}</div><div className={styles.statLabel}>Used</div></div>
          <div className={styles.stat}><div className={styles.statNum} style={{ color: remaining < 0 ? '#e55' : 'inherit' }}>{remaining}</div><div className={styles.statLabel}>Remaining</div></div>
          <div className={styles.stat}><div className={styles.statNum}>{limit}</div><div className={styles.statLabel}>Limit</div></div>
        </div>
      </div>
    </ConverterShell>
  );
}
