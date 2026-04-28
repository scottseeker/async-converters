import { useMemo, useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const { highlighted, matches } = useMemo(() => {
    setError('');
    if (!pattern || !text) return { highlighted: text, matches: [] };
    try {
      const re = new RegExp(pattern, flags.replace('g', '') + 'g');
      const allMatches: RegExpExecArray[] = [];
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        allMatches.push(m);
        if (!flags.includes('g')) break;
      }
      // Build highlighted HTML
      let result = '';
      let last = 0;
      for (const match of allMatches) {
        result += text.slice(last, match.index).replace(/&/g,'&amp;').replace(/</g,'&lt;');
        result += `<mark class="regexMatch">${match[0].replace(/&/g,'&amp;').replace(/</g,'&lt;')}</mark>`;
        last = match.index + match[0].length;
      }
      result += text.slice(last).replace(/&/g,'&amp;').replace(/</g,'&lt;');
      return { highlighted: result, matches: allMatches };
    } catch (e) {
      setError((e as Error).message);
      return { highlighted: text, matches: [] };
    }
  }, [pattern, flags, text]);

  return (
    <ConverterShell title="Regex Tester" description="Test regular expressions against input text with live match highlighting." category="developer">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1 }}>
            <label htmlFor="re-pattern">Pattern</label>
            <input id="re-pattern" type="text" placeholder="e.g. \b\w+@\w+\.\w+\b" value={pattern} onChange={e => setPattern(e.target.value)} style={{ fontFamily: 'var(--font-mono)' }} />
          </div>
          <div className={styles.field} style={{ width: 120 }}>
            <label htmlFor="re-flags">Flags</label>
            <input id="re-flags" type="text" placeholder="gim" value={flags} onChange={e => setFlags(e.target.value)} style={{ fontFamily: 'var(--font-mono)' }} />
          </div>
        </div>
        {error && <p className={styles.error}>⚠ {error}</p>}
        <div className={styles.field}>
          <label htmlFor="re-text">Test Text</label>
          <textarea id="re-text" className={styles.codeArea} placeholder="Enter text to test…" value={text} onChange={e => setText(e.target.value)} />
        </div>
        {text && (
          <>
            <p className={styles.matchCount}>{matches.length} match{matches.length !== 1 ? 'es' : ''}</p>
            <div className={styles.field}>
              <label>Highlighted Output</label>
              <div
                className={styles.codeArea}
                style={{ minHeight: 100, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                dangerouslySetInnerHTML={{ __html: highlighted }}
              />
            </div>
          </>
        )}
      </div>
      <style>{`.regexMatch { background: color-mix(in srgb, var(--accent) 30%, transparent); border-radius: 2px; }`}</style>
    </ConverterShell>
  );
}
