import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './social.module.css';

const NICHE_TAGS: Record<string, string[]> = {
  travel: ['travel','wanderlust','travelgram','adventure','explore','vacation','trip','travelphotography','instatravel','travellife'],
  food: ['food','foodie','foodphotography','instafood','yummy','delicious','cooking','recipe','foodblogger','homecooking'],
  fitness: ['fitness','workout','gym','fitnessmotivation','fit','health','training','bodybuilding','exercise','fitfam'],
  fashion: ['fashion','style','ootd','outfit','fashionblogger','streetstyle','trendy','clothing','inspo','fashionista'],
  tech: ['tech','technology','coding','developer','programming','software','innovation','gadgets','ai','startup'],
};

export default function HashtagGenerator() {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('');
  const [count, setCount] = useState(15);

  function generate() {
    const base = topic.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean).map(w => `#${w}`);
    const extra = NICHE_TAGS[niche] ? NICHE_TAGS[niche].map(t => `#${t}`) : [];
    const all = [...new Set([...base, ...extra])];
    return all.slice(0, count).join(' ');
  }

  const output = generate();

  return (
    <ConverterShell title="Hashtag Generator" description="Generate relevant hashtags for Instagram, TikTok, and Twitter posts." category="social">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="hg-topic">Post topic / keywords</label>
          <input id="hg-topic" type="text" placeholder="sunrise beach yoga morning" value={topic} onChange={e => setTopic(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="hg-niche">Niche (optional)</label>
            <select id="hg-niche" value={niche} onChange={e => setNiche(e.target.value)} style={{ width: '100%' }}>
              <option value="">— select —</option>
              {Object.keys(NICHE_TAGS).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label htmlFor="hg-count">Count: {count}</label>
            <input id="hg-count" type="range" min={5} max={30} value={count} onChange={e => setCount(Number(e.target.value))} />
          </div>
        </div>
        {output && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}><div className={styles.statNum}>{output.split(' ').length}</div><div className={styles.statLabel}>Hashtags</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{output.length}</div><div className={styles.statLabel}>Characters</div></div>
            </div>
            <div className={styles.field}>
              <label>Hashtags</label>
              <textarea className={styles.outputArea} readOnly value={output} />
            </div>
            <div className={styles.actions}>
              <button onClick={() => navigator.clipboard.writeText(output)}>Copy Hashtags</button>
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
