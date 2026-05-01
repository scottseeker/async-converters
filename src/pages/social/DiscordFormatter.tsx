import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './social.module.css';

export default function DiscordFormatter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'bold'|'italic'|'code'|'codeblock'|'spoiler'|'quote'>('bold');

  const WRAP: Record<string, [string, string]> = {
    bold: ['**', '**'],
    italic: ['*', '*'],
    code: ['`', '`'],
    codeblock: ['```\n', '\n```'],
    spoiler: ['||', '||'],
    quote: ['> ', ''],
  };

  function format(text: string) {
    const [pre, post] = WRAP[mode];
    if (mode === 'quote') {
      return text.split('\n').map(l => `> ${l}`).join('\n');
    }
    return `${pre}${text}${post}`;
  }

  const output = format(input);

  return (
    <ConverterShell title="Discord Formatter" description="Format text with Discord markdown: bold, italic, code blocks, spoilers, and quotes." category="social">
      <div className={styles.form}>
        <div className={styles.actions}>
          {(['bold','italic','code','codeblock','spoiler','quote'] as const).map(m => (
            <button key={m} style={mode === m ? { background: 'var(--accent)', color: '#fff' } : {}} onClick={() => setMode(m)}>{m}</button>
          ))}
        </div>
        <div className={styles.field}>
          <label htmlFor="df-in">Text</label>
          <textarea id="df-in" style={{ minHeight: 120 }} placeholder="Enter text to format…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        {input && (
          <>
            <div className={styles.field}>
              <label>Formatted (Discord markdown)</label>
              <textarea className={styles.outputArea} readOnly value={output} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }} />
            </div>
            <div className={styles.actions}>
              <button onClick={() => navigator.clipboard.writeText(output)}>Copy Formatted</button>
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
