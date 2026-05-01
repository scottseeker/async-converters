import { useState } from 'react';
import { js as beautifyJs } from 'js-beautify';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

export default function JsBeautifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);

  function beautify() {
    setOutput(beautifyJs(input, { indent_size: indent, space_in_empty_paren: true }));
  }

  function minify() {
    setOutput(input.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '').replace(/\s+/g, ' ').replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1').trim());
  }

  return (
    <ConverterShell title="JS Beautifier" description="Beautify or minify JavaScript code." category="developer">
      <div className={styles.form}>
        <div className={styles.field} style={{ maxWidth: 200 }}>
          <label>Indent size: {indent}</label>
          <input type="range" min={1} max={8} value={indent} onChange={e => setIndent(Number(e.target.value))} />
        </div>
        <div className={styles.field}>
          <label>JavaScript</label>
          <textarea style={{ minHeight: 200, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} placeholder="function hello(){console.log('hi')}" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.actions}>
          <button onClick={beautify}>Beautify</button>
          <button onClick={minify}>Minify</button>
          <button onClick={() => { setInput(''); setOutput(''); }}>Clear</button>
        </div>
        {output && (
          <>
            <div className={styles.field}>
              <label>Output</label>
              <textarea className={styles.outputArea} readOnly value={output} style={{ minHeight: 200, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} />
            </div>
            <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(output)}>Copy</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
