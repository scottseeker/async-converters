import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

export default function UtmBuilder() {
  const [baseUrl, setBaseUrl] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');

  function buildUrl() {
    if (!baseUrl) return '';
    try {
      const url = new URL(baseUrl.startsWith('http') ? baseUrl : 'https://' + baseUrl);
      if (source) url.searchParams.set('utm_source', source);
      if (medium) url.searchParams.set('utm_medium', medium);
      if (campaign) url.searchParams.set('utm_campaign', campaign);
      if (term) url.searchParams.set('utm_term', term);
      if (content) url.searchParams.set('utm_content', content);
      return url.toString();
    } catch { return 'Invalid URL'; }
  }

  const result = buildUrl();

  const PRESETS = [
    { label: 'Email', source: 'newsletter', medium: 'email', campaign: 'promo' },
    { label: 'Facebook', source: 'facebook', medium: 'social', campaign: 'campaign' },
    { label: 'Google', source: 'google', medium: 'cpc', campaign: 'ads' },
    { label: 'Twitter', source: 'twitter', medium: 'social', campaign: 'post' },
  ];

  return (
    <ConverterShell title="UTM Link Builder" description="Build UTM-tagged campaign URLs for tracking in Google Analytics." category="developer">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => { setSource(p.source); setMedium(p.medium); setCampaign(p.campaign); }}>{p.label}</button>
          ))}
        </div>
        <div className={styles.field}>
          <label>Website URL</label>
          <input type="url" placeholder="https://example.com/page" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[['Source *', source, setSource, 'google, newsletter, facebook'], ['Medium *', medium, setMedium, 'cpc, email, social'], ['Campaign *', campaign, setCampaign, 'spring_sale'], ['Term', term, setTerm, 'running shoes'], ['Content', content, setContent, 'logo_link']].map(([label, val, setter, ph]) => (
            <div key={String(label)} className={styles.field} style={{ flex: 1, minWidth: 150 }}>
              <label>{label as string}</label>
              <input type="text" placeholder={ph as string} value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} />
            </div>
          ))}
        </div>
        {result && (
          <>
            <div className={styles.field}>
              <label>UTM URL</label>
              <textarea className={styles.outputArea} readOnly value={result} style={{ minHeight: 70, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', wordBreak: 'break-all' }} />
            </div>
            <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(result)}>Copy URL</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
