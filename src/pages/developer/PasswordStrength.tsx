import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

function scorePassword(pwd: string): { score: number; label: string; color: string; tips: string[] } {
  const tips: string[] = [];
  let score = 0;
  if (pwd.length >= 8) score += 1; else tips.push('Use at least 8 characters');
  if (pwd.length >= 12) score += 1; else if (pwd.length >= 8) tips.push('12+ characters is better');
  if (pwd.length >= 16) score += 1;
  if (/[a-z]/.test(pwd)) score += 1; else tips.push('Add lowercase letters');
  if (/[A-Z]/.test(pwd)) score += 1; else tips.push('Add uppercase letters');
  if (/[0-9]/.test(pwd)) score += 1; else tips.push('Add numbers');
  if (/[^a-zA-Z0-9]/.test(pwd)) score += 1; else tips.push('Add symbols (!@#$...)');
  if (/(.)\1{2,}/.test(pwd)) { score -= 1; tips.push('Avoid repeated characters'); }

  const pct = Math.min(100, (score / 7) * 100);
  const label = pct < 30 ? 'Very Weak' : pct < 50 ? 'Weak' : pct < 65 ? 'Fair' : pct < 80 ? 'Strong' : 'Very Strong';
  const color = pct < 30 ? '#e74c3c' : pct < 50 ? '#e67e22' : pct < 65 ? '#f1c40f' : pct < 80 ? '#2ecc71' : '#00bcd4';

  return { score: pct, label, color, tips };
}

export default function PasswordStrength() {
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);

  const { score, label, color, tips } = pwd ? scorePassword(pwd) : { score: 0, label: '', color: '#ccc', tips: [] };

  return (
    <ConverterShell title="Password Strength Checker" description="Test the strength of a password and get actionable improvement tips." category="developer">
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Password</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type={show ? 'text' : 'password'}
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              placeholder="Enter password to test…"
              style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
              autoComplete="off"
            />
            <button onClick={() => setShow(s => !s)}>{show ? '🙈' : '👁'}</button>
          </div>
        </div>
        {pwd && (
          <>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontWeight: 600, color }}>
                <span>{label}</span><span>{score.toFixed(0)}%</span>
              </div>
              <div style={{ background: 'var(--bg-card)', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                <div style={{ width: `${score}%`, background: color, height: '100%', transition: 'width 0.3s' }} />
              </div>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}><div className={styles.statNum}>{pwd.length}</div><div className={styles.statLabel}>Length</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{(pwd.match(/[A-Z]/g)||[]).length}</div><div className={styles.statLabel}>Uppercase</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{(pwd.match(/[0-9]/g)||[]).length}</div><div className={styles.statLabel}>Numbers</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{(pwd.match(/[^a-zA-Z0-9]/g)||[]).length}</div><div className={styles.statLabel}>Symbols</div></div>
            </div>
            {tips.length > 0 && (
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {tips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            )}
          </>
        )}
      </div>
    </ConverterShell>
  );
}
