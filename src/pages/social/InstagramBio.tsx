import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './social.module.css';

const MAX = 150;

export default function InstagramBio() {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [links, setLinks] = useState('');
  const [emoji, setEmoji] = useState('');

  const bio = [
    name ? `${emoji ? emoji + ' ' : ''}${name}` : '',
    tagline,
    links,
  ].filter(Boolean).join('\n');

  const remaining = MAX - bio.length;

  return (
    <ConverterShell title="Instagram Bio Generator" description="Build a clean, emoji-enhanced Instagram bio within the 150-character limit." category="social">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 2, minWidth: 160 }}>
            <label htmlFor="ib-name">Name / Title</label>
            <input id="ib-name" type="text" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}>
            <label htmlFor="ib-emoji">Emoji</label>
            <input id="ib-emoji" type="text" placeholder="✨" value={emoji} onChange={e => setEmoji(e.target.value)} />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="ib-tagline">Tagline / Description</label>
          <input id="ib-tagline" type="text" placeholder="Content creator | Travel lover" value={tagline} onChange={e => setTagline(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="ib-links">Links / CTA</label>
          <input id="ib-links" type="text" placeholder="👇 New video every week" value={links} onChange={e => setLinks(e.target.value)} />
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}><div className={styles.statNum}>{bio.length}</div><div className={styles.statLabel}>Characters used</div></div>
          <div className={styles.stat}><div className={styles.statNum} style={{ color: remaining < 0 ? '#e55' : 'inherit' }}>{remaining}</div><div className={styles.statLabel}>Remaining</div></div>
        </div>
        {bio && (
          <>
            <div className={styles.field}>
              <label>Bio Preview</label>
              <textarea className={styles.outputArea} readOnly value={bio} style={{ minHeight: 100 }} />
            </div>
            <div className={styles.actions}>
              <button onClick={() => navigator.clipboard.writeText(bio)}>Copy Bio</button>
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
