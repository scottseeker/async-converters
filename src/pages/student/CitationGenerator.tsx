import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './student.module.css';

type Style = 'APA' | 'MLA' | 'Chicago';
type SourceType = 'book' | 'website' | 'journal';

export default function CitationGenerator() {
  const [style, setStyle] = useState<Style>('APA');
  const [type, setType] = useState<SourceType>('book');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [url, setUrl] = useState('');
  const [journal, setJournal] = useState('');
  const [volume, setVolume] = useState('');
  const [pages, setPages] = useState('');

  function generate(): string {
    const a = author.trim() || 'Author, A.';
    const y = year.trim() || new Date().getFullYear().toString();
    const t = title.trim() || 'Title';
    const p = publisher.trim();
    const u = url.trim();
    const j = journal.trim();

    if (style === 'APA') {
      if (type === 'book') return `${a} (${y}). *${t}*. ${p}.`;
      if (type === 'website') return `${a} (${y}). *${t}*. Retrieved from ${u}`;
      if (type === 'journal') return `${a} (${y}). ${t}. *${j}*, *${volume}*, ${pages}.`;
    }
    if (style === 'MLA') {
      if (type === 'book') return `${a}. *${t}*. ${p}, ${y}.`;
      if (type === 'website') return `${a}. "${t}." *Web*. ${y}. <${u}>.`;
      if (type === 'journal') return `${a}. "${t}." *${j}* ${volume} (${y}): ${pages}.`;
    }
    if (style === 'Chicago') {
      if (type === 'book') return `${a}. *${t}*. ${p}, ${y}.`;
      if (type === 'website') return `${a}. "${t}." Accessed ${y}. ${u}.`;
      if (type === 'journal') return `${a}. "${t}." *${j}* ${volume}, no. 1 (${y}): ${pages}.`;
    }
    return '';
  }

  const citation = generate();

  return (
    <ConverterShell title="Citation Generator" description="Generate APA, MLA, and Chicago citations for books, websites, and journals." category="student">
      <div className={styles.form}>
        <div className={styles.actions}>
          {(['APA','MLA','Chicago'] as Style[]).map(s => (
            <button key={s} style={style === s ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setStyle(s)}>{s}</button>
          ))}
        </div>
        <div className={styles.actions}>
          {(['book','website','journal'] as SourceType[]).map(t => (
            <button key={t} style={type === t ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setType(t)}>{t}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 2, minWidth: 140 }}>
            <label>Author (Last, First)</label>
            <input type="text" placeholder="Smith, John" value={author} onChange={e => setAuthor(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}>
            <label>Year</label>
            <input type="text" placeholder="2024" value={year} onChange={e => setYear(e.target.value)} />
          </div>
        </div>
        <div className={styles.field}>
          <label>Title</label>
          <input type="text" placeholder="The Book Title" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        {type === 'book' && (
          <div className={styles.field}>
            <label>Publisher</label>
            <input type="text" placeholder="Publisher Name" value={publisher} onChange={e => setPublisher(e.target.value)} />
          </div>
        )}
        {type === 'website' && (
          <div className={styles.field}>
            <label>URL</label>
            <input type="url" placeholder="https://example.com/page" value={url} onChange={e => setUrl(e.target.value)} />
          </div>
        )}
        {type === 'journal' && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className={styles.field} style={{ flex: 2, minWidth: 140 }}>
              <label>Journal Name</label>
              <input type="text" placeholder="Journal of Science" value={journal} onChange={e => setJournal(e.target.value)} />
            </div>
            <div className={styles.field} style={{ flex: 1, minWidth: 70 }}>
              <label>Volume</label>
              <input type="text" placeholder="12" value={volume} onChange={e => setVolume(e.target.value)} />
            </div>
            <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
              <label>Pages</label>
              <input type="text" placeholder="100-115" value={pages} onChange={e => setPages(e.target.value)} />
            </div>
          </div>
        )}
        <div className={styles.field}>
          <label>Generated Citation</label>
          <textarea className={styles.outputArea} readOnly value={citation} style={{ minHeight: 80, fontStyle: 'italic' }} />
        </div>
        <div className={styles.actions}>
          <button onClick={() => navigator.clipboard.writeText(citation)}>Copy Citation</button>
        </div>
      </div>
    </ConverterShell>
  );
}
