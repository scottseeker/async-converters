import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

export default function RobotsGenerator() {
  const [allowAll, setAllowAll] = useState(true);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [crawlDelay, setCrawlDelay] = useState('');
  const [rules, setRules] = useState([{ agent: '*', allow: '', disallow: '/admin/' }]);

  function addRule() { setRules(r => [...r, { agent: '*', allow: '', disallow: '' }]); }
  function removeRule(i: number) { setRules(r => r.filter((_, j) => j !== i)); }

  const output = [
    ...(allowAll
      ? ['User-agent: *', 'Allow: /']
      : rules.flatMap(r => [
          `User-agent: ${r.agent}`,
          ...(r.disallow ? [`Disallow: ${r.disallow}`] : []),
          ...(r.allow ? [`Allow: ${r.allow}`] : []),
        ])
    ),
    ...(crawlDelay ? [`Crawl-delay: ${crawlDelay}`] : []),
    ...(sitemapUrl ? [``, `Sitemap: ${sitemapUrl}`] : []),
  ].join('\n');

  return (
    <ConverterShell title="robots.txt Generator" description="Build a robots.txt file for your website." category="developer">
      <div className={styles.form}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={allowAll} onChange={e => setAllowAll(e.target.checked)} />
          Allow all crawlers (simple Allow: /)
        </label>
        {!allowAll && (
          <>
            {rules.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
                  {i === 0 && <label>User-agent</label>}
                  <input type="text" value={r.agent} onChange={e => { const rs = [...rules]; rs[i].agent = e.target.value; setRules(rs); }} />
                </div>
                <div className={styles.field} style={{ flex: 2, minWidth: 140 }}>
                  {i === 0 && <label>Disallow path</label>}
                  <input type="text" placeholder="/private/" value={r.disallow} onChange={e => { const rs = [...rules]; rs[i].disallow = e.target.value; setRules(rs); }} />
                </div>
                <div className={styles.field} style={{ flex: 2, minWidth: 140 }}>
                  {i === 0 && <label>Allow path</label>}
                  <input type="text" placeholder="/public/" value={r.allow} onChange={e => { const rs = [...rules]; rs[i].allow = e.target.value; setRules(rs); }} />
                </div>
                {rules.length > 1 && <button onClick={() => removeRule(i)} style={{ marginBottom: 4 }}>✕</button>}
              </div>
            ))}
            <div className={styles.actions}><button onClick={addRule}>+ Add rule</button></div>
          </>
        )}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 2, minWidth: 180 }}>
            <label>Sitemap URL (optional)</label>
            <input type="url" placeholder="https://example.com/sitemap.xml" value={sitemapUrl} onChange={e => setSitemapUrl(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Crawl delay (optional)</label>
            <input type="number" min={0} placeholder="10" value={crawlDelay} onChange={e => setCrawlDelay(e.target.value)} />
          </div>
        </div>
        <div className={styles.field}>
          <label>robots.txt</label>
          <textarea className={styles.outputArea} readOnly value={output} style={{ minHeight: 150, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }} />
        </div>
        <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(output)}>Copy</button></div>
      </div>
    </ConverterShell>
  );
}
