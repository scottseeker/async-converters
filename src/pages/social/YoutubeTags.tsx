import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './social.module.css';

const BASE_TAGS: Record<string, string[]> = {
  gaming: ['gaming','gameplay','gamer','ps5','xbox','pcgaming','videogames','twitch','streamer','esports'],
  vlog: ['vlog','dailyvlog','vlogger','dayinmylife','lifestylevlog','weeklyupload','videoblog'],
  tutorial: ['tutorial','howto','diy','learnwithme','tips','tricks','guide','stepbystep'],
  music: ['music','newmusic','musician','singer','songwriter','indiemusic','hiphop','pop'],
  fitness: ['fitness','workout','gym','motivation','health','exercise','fitnesschannel'],
};

export default function YoutubeTags() {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');

  function generate() {
    const words = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    const extra = BASE_TAGS[niche] ?? [];
    return [...new Set([...words, ...extra])].slice(0, 30).join(', ');
  }

  const output = generate();

  return (
    <ConverterShell title="YouTube Tag Generator" description="Generate optimized tags for your YouTube video to improve discoverability." category="social">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="yt-title">Video Title / Keywords</label>
          <input id="yt-title" type="text" placeholder="How to make the best chocolate cake" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="yt-niche">Channel Niche</label>
          <select id="yt-niche" value={niche} onChange={e => setNiche(e.target.value)} style={{ width: '100%' }}>
            <option value="">— optional —</option>
            {Object.keys(BASE_TAGS).map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        {output && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}><div className={styles.statNum}>{output.split(', ').length}</div><div className={styles.statLabel}>Tags</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{output.length}</div><div className={styles.statLabel}>Characters</div></div>
            </div>
            <div className={styles.field}>
              <label>Tags</label>
              <textarea className={styles.outputArea} readOnly value={output} />
            </div>
            <div className={styles.actions}>
              <button onClick={() => navigator.clipboard.writeText(output)}>Copy Tags</button>
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
