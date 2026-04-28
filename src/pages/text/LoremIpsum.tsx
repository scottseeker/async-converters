import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import { generateLorem } from '../../converters/text/lorem';
import styles from './text.module.css';

export default function LoremIpsum() {
  const [paras, setParas] = useState(3);
  const [sents, setSents] = useState(5);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  function generate() {
    setOutput(generateLorem(paras, sents));
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <ConverterShell title="Lorem Ipsum Generator" description="Generate random placeholder Latin text." category="text">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className={styles.field} style={{ width: 160 }}>
            <label htmlFor="li-paras">Paragraphs</label>
            <input id="li-paras" type="number" min={1} max={20} value={paras} onChange={e => setParas(Number(e.target.value))} />
          </div>
          <div className={styles.field} style={{ width: 180 }}>
            <label htmlFor="li-sents">Sentences / paragraph</label>
            <input id="li-sents" type="number" min={1} max={15} value={sents} onChange={e => setSents(Number(e.target.value))} />
          </div>
          <button className="btn-primary" onClick={generate}>Generate</button>
        </div>

        {output && (
          <>
            <div className={styles.field}>
              <label>Output</label>
              <textarea className={styles.outputArea} style={{ minHeight: 220 }} readOnly value={output} />
            </div>
            <div className={styles.actions}>
              <button className="btn-secondary" onClick={copy}>{copied ? '✓ Copied!' : 'Copy to clipboard'}</button>
              <button className="btn-secondary" onClick={generate}>Regenerate</button>
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
