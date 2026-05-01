import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

export default function HtaccessGenerator() {
  const [redirect, setRedirect] = useState('');
  const [redirectTo, setRedirectTo] = useState('');
  const [wwwRedirect, setWwwRedirect] = useState<'none' | 'add' | 'remove'>('none');
  const [https, setHttps] = useState(false);
  const [gzip, setGzip] = useState(false);
  const [cacheAge, setCacheAge] = useState('');
  const [noIndex, setNoIndex] = useState(false);

  const lines: string[] = [];

  if (https) {
    lines.push('# Force HTTPS', 'RewriteEngine On', 'RewriteCond %{HTTPS} off', 'RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]', '');
  }

  if (wwwRedirect === 'add') {
    lines.push('# Redirect to www', 'RewriteEngine On', 'RewriteCond %{HTTP_HOST} !^www\\.', 'RewriteRule ^ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]', '');
  } else if (wwwRedirect === 'remove') {
    lines.push('# Remove www', 'RewriteEngine On', 'RewriteCond %{HTTP_HOST} ^www\\.(.+)$', 'RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301]', '');
  }

  if (redirect && redirectTo) {
    lines.push(`# 301 Redirect`, `Redirect 301 ${redirect} ${redirectTo}`, '');
  }

  if (gzip) {
    lines.push('# Enable Gzip', '<IfModule mod_deflate.c>', '  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json', '</IfModule>', '');
  }

  if (cacheAge) {
    lines.push('# Browser caching', `<IfModule mod_expires.c>`, `  ExpiresActive On`, `  ExpiresDefault "access plus ${cacheAge} days"`, `</IfModule>`, '');
  }

  if (noIndex) {
    lines.push('# Disable directory listing', 'Options -Indexes', '');
  }

  const output = lines.join('\n').trim();

  return (
    <ConverterShell title=".htaccess Generator" description="Generate common .htaccess rules for Apache servers." category="developer">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          {[['Force HTTPS', https, setHttps], ['Gzip', gzip, setGzip], ['No directory listing', noIndex, setNoIndex]].map(([label, val, setter]) => (
            <label key={String(label)} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={val as boolean} onChange={e => (setter as (v: boolean) => void)(e.target.checked)} /> {label as string}
            </label>
          ))}
        </div>
        <div className={styles.field}>
          <label>WWW redirect</label>
          <select value={wwwRedirect} onChange={e => setWwwRedirect(e.target.value as never)}>
            <option value="none">No redirect</option>
            <option value="add">Force www</option>
            <option value="remove">Remove www</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label>301 redirect from</label>
            <input type="text" placeholder="/old-page" value={redirect} onChange={e => setRedirect(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label>301 redirect to</label>
            <input type="text" placeholder="/new-page" value={redirectTo} onChange={e => setRedirectTo(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label>Cache age (days)</label>
            <input type="number" min={0} placeholder="30" value={cacheAge} onChange={e => setCacheAge(e.target.value)} />
          </div>
        </div>
        <div className={styles.field}>
          <label>.htaccess</label>
          <textarea className={styles.outputArea} readOnly value={output || '# No rules selected'} style={{ minHeight: 200, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} />
        </div>
        <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(output)}>Copy</button></div>
      </div>
    </ConverterShell>
  );
}
