import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

export default function OpengraphPreview() {
  const [title, setTitle] = useState('My Amazing Page');
  const [description, setDescription] = useState('This is the meta description that shows in social previews.');
  const [url, setUrl] = useState('https://example.com/page');
  const [image, setImage] = useState('https://via.placeholder.com/1200x630');
  const [site, setSite] = useState('example.com');
  const [platform, setPlatform] = useState<'twitter' | 'facebook' | 'linkedin'>('twitter');

  const meta = `<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${image}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${image}" />`;

  return (
    <ConverterShell title="Open Graph Preview" description="Preview how your page will look when shared on social media." category="developer">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          {(['twitter','facebook','linkedin'] as const).map(p => (
            <button key={p} style={platform === p ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setPlatform(p)}>{p}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[['Title', title, setTitle], ['URL', url, setUrl], ['Site name', site, setSite], ['Image URL', image, setImage]].map(([label, val, setter]) => (
            <div key={String(label)} className={styles.field} style={{ flex: 1, minWidth: 180 }}>
              <label>{label as string}</label>
              <input type="text" value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} />
            </div>
          ))}
          <div className={styles.field} style={{ flex: '0 0 100%' }}>
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ minHeight: 70 }} />
          </div>
        </div>
        {/* Preview card */}
        <div style={{ border: '1px solid var(--border)', borderRadius: platform === 'twitter' ? 16 : 8, overflow: 'hidden', maxWidth: 500 }}>
          {image && <img src={image} alt="og" style={{ width: '100%', aspectRatio: '1200/630', objectFit: 'cover', display: 'block' }} onError={e => (e.currentTarget.style.display = 'none')} />}
          <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{site}</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{title || 'Title'}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</div>
          </div>
        </div>
        <div className={styles.field}>
          <label>Meta tags</label>
          <textarea className={styles.outputArea} readOnly value={meta} style={{ minHeight: 180, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
        </div>
        <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(meta)}>Copy meta tags</button></div>
      </div>
    </ConverterShell>
  );
}
