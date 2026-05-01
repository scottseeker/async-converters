import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';

export default function SocialPreview() {
  const [title, setTitle] = useState('My Awesome Page');
  const [desc, setDesc] = useState('A great description for social sharing.');
  const [imgUrl, setImgUrl] = useState('');
  const [url, setUrl] = useState('https://example.com');
  const [active, setActive] = useState<'twitter' | 'facebook' | 'linkedin'>('twitter');

  const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();

  const CardTwitter = () => (
    <div style={{ border: '1px solid #e7e7e7', borderRadius: 16, overflow: 'hidden', maxWidth: 506, fontFamily: 'system-ui', fontSize: 14 }}>
      {imgUrl && <img src={imgUrl} alt="" style={{ width: '100%', height: 264, objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
      {!imgUrl && <div style={{ height: 264, background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>No image</div>}
      <div style={{ padding: '12px 16px', background: '#fff' }}>
        <p style={{ color: '#536471', margin: '0 0 4px', fontSize: 13 }}>{domain}</p>
        <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#0f1419' }}>{title || 'Page Title'}</p>
        <p style={{ margin: 0, color: '#536471', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{desc}</p>
      </div>
    </div>
  );

  const CardFacebook = () => (
    <div style={{ border: '1px solid #dddfe2', maxWidth: 527, fontFamily: 'helvetica,arial,sans-serif', fontSize: 14 }}>
      {imgUrl && <img src={imgUrl} alt="" style={{ width: '100%', height: 272, objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
      {!imgUrl && <div style={{ height: 272, background: 'linear-gradient(135deg,#1877f2,#42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>No image</div>}
      <div style={{ padding: '10px 12px', background: '#f0f2f5', borderTop: '1px solid #dddfe2' }}>
        <p style={{ margin: '0 0 2px', textTransform: 'uppercase', color: '#606770', fontSize: 11 }}>{domain}</p>
        <p style={{ margin: '0 0 2px', fontWeight: 600, color: '#1d2129' }}>{title || 'Page Title'}</p>
        <p style={{ margin: 0, color: '#606770', fontSize: 13 }}>{desc}</p>
      </div>
    </div>
  );

  const CardLinkedIn = () => (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden', maxWidth: 520, fontFamily: 'system-ui', background: '#fff', fontSize: 14 }}>
      {imgUrl && <img src={imgUrl} alt="" style={{ width: '100%', height: 272, objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
      {!imgUrl && <div style={{ height: 272, background: 'linear-gradient(135deg,#0a66c2,#4fc3f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>No image</div>}
      <div style={{ padding: '8px 12px', background: '#f3f2ef' }}>
        <p style={{ margin: '0 0 2px', fontWeight: 700, color: '#000' }}>{title || 'Page Title'}</p>
        <p style={{ margin: 0, color: '#666', fontSize: 12 }}>{domain}</p>
      </div>
    </div>
  );

  return (
    <ConverterShell title="Social Preview" description="Preview how your page looks when shared on Twitter, Facebook, or LinkedIn." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Page Title</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="My Awesome Page" /></div>
        <div className={styles.field}><label>Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="A great description..." /></div>
        <div className={styles.field}><label>OG Image URL</label><input value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="https://..." /></div>
        <div className={styles.field}><label>Page URL</label><input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" /></div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['twitter', 'facebook', 'linkedin'] as const).map(p => (
            <button key={p} style={active === p ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setActive(p)}>{p}</button>
          ))}
        </div>
        <div style={{ padding: '1rem', background: active === 'twitter' ? '#fff' : active === 'facebook' ? '#f0f2f5' : '#f3f2ef', borderRadius: 12 }}>
          {active === 'twitter' && <CardTwitter />}
          {active === 'facebook' && <CardFacebook />}
          {active === 'linkedin' && <CardLinkedIn />}
        </div>
      </div>
    </ConverterShell>
  );
}
