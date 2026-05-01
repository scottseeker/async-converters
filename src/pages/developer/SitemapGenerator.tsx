import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

export default function SitemapGenerator() {
  const [urls, setUrls] = useState('https://example.com/\nhttps://example.com/about\nhttps://example.com/contact');
  const [changefreq, setChangefreq] = useState('weekly');
  const [priority, setPriority] = useState('0.8');

  const lines = urls.split('\n').map(l => l.trim()).filter(Boolean);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${lines.map(u => `  <url>
    <loc>${u}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  function download() {
    const blob = new Blob([xml], { type: 'application/xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sitemap.xml';
    a.click();
  }

  return (
    <ConverterShell title="Sitemap Generator" description="Generate a sitemap.xml file from a list of URLs." category="developer">
      <div className={styles.form}>
        <div className={styles.field}>
          <label>URLs (one per line)</label>
          <textarea style={{ minHeight: 140 }} value={urls} onChange={e => setUrls(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label>Change frequency</label>
            <select value={changefreq} onChange={e => setChangefreq(e.target.value)}>
              {['always','hourly','daily','weekly','monthly','yearly','never'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              {['1.0','0.9','0.8','0.7','0.6','0.5','0.4','0.3','0.2','0.1'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.field}>
          <label>sitemap.xml preview</label>
          <textarea className={styles.outputArea} readOnly value={xml} style={{ minHeight: 200, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
        </div>
        <div className={styles.actions}>
          <button onClick={() => navigator.clipboard.writeText(xml)}>Copy</button>
          <button onClick={download}>Download</button>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lines.length} URLs</div>
      </div>
    </ConverterShell>
  );
}
