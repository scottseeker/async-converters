import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

function toCamel(s: string) {
  return s.replace(/[-_\s]+(.)/g, (_, c: string) => c.toUpperCase()).replace(/^(.)/, c => c.toLowerCase());
}
function toPascal(s: string) {
  return s.replace(/[-_\s]+(.)/g, (_, c: string) => c.toUpperCase()).replace(/^(.)/, c => c.toUpperCase());
}
function toSnake(s: string) {
  return s.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
}
function toKebab(s: string) {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]+/g, '-').toLowerCase();
}
function toTitle(s: string) {
  return s.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
function toConstant(s: string) {
  return toSnake(s).toUpperCase();
}

const CASES = [
  { label: 'camelCase',    fn: toCamel },
  { label: 'PascalCase',   fn: toPascal },
  { label: 'snake_case',   fn: toSnake },
  { label: 'kebab-case',   fn: toKebab },
  { label: 'Title Case',   fn: toTitle },
  { label: 'UPPER CASE',   fn: (s: string) => s.toUpperCase() },
  { label: 'lower case',   fn: (s: string) => s.toLowerCase() },
  { label: 'CONSTANT_CASE',fn: toConstant },
];

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  }

  return (
    <ConverterShell title="Case Converter" description="Convert text between camelCase, snake_case, kebab-case, PascalCase, and more." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="case-in">Input Text</label>
          <textarea id="case-in" placeholder="Enter text to convert…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        {input && (
          <div className={styles.cases}>
            {CASES.map(c => {
              const val = c.fn(input);
              return (
                <div key={c.label} className={styles.caseCard}>
                  <div className={styles.caseLabel}>{c.label}</div>
                  <div className={styles.caseValue}>{val}</div>
                  <button className={styles.copyBtn} onClick={() => copy(val, c.label)}>
                    {copied === c.label ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
