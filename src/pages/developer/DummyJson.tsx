import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

const FIRST = ['Alice','Bob','Charlie','Dave','Eve','Frank','Grace','Heidi','Ivan','Judy','Mallory','Oscar','Peggy','Trent','Walter'];
const LAST = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Anderson','Taylor','Thomas','Jackson','White','Harris'];
const DOMAINS = ['example.com','test.dev','demo.io','sample.org','fake.net'];
const LOREM = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ');

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min: number, max: number, dec = 2) { return +(Math.random() * (max - min) + min).toFixed(dec); }

function generate(count: number, fields: string[]): Record<string, unknown>[] {
  return Array.from({ length: count }, (_, id) => {
    const first = rand(FIRST), last = rand(LAST);
    const obj: Record<string, unknown> = {};
    if (fields.includes('id')) obj.id = id + 1;
    if (fields.includes('name')) obj.name = `${first} ${last}`;
    if (fields.includes('email')) obj.email = `${first.toLowerCase()}.${last.toLowerCase()}@${rand(DOMAINS)}`;
    if (fields.includes('age')) obj.age = randInt(18, 75);
    if (fields.includes('price')) obj.price = randFloat(1, 999);
    if (fields.includes('active')) obj.active = Math.random() > 0.5;
    if (fields.includes('createdAt')) obj.createdAt = new Date(Date.now() - randInt(0, 1000) * 86400000).toISOString().split('T')[0];
    if (fields.includes('bio')) obj.bio = Array.from({ length: randInt(8, 18) }, () => rand(LOREM)).join(' ') + '.';
    return obj;
  });
}

const ALL_FIELDS = ['id','name','email','age','price','active','createdAt','bio'];

export default function DummyJson() {
  const [count, setCount] = useState(5);
  const [fields, setFields] = useState(['id','name','email','age']);
  const [output, setOutput] = useState('');

  function toggleField(f: string) {
    setFields(fs => fs.includes(f) ? fs.filter(x => x !== f) : [...fs, f]);
  }

  function gen() {
    setOutput(JSON.stringify(generate(count, fields), null, 2));
  }

  return (
    <ConverterShell title="Dummy JSON Generator" description="Generate realistic mock JSON data for testing and prototyping." category="developer">
      <div className={styles.form}>
        <div className={styles.field} style={{ maxWidth: 220 }}>
          <label>Count: {count}</label>
          <input type="range" min={1} max={100} value={count} onChange={e => setCount(Number(e.target.value))} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {ALL_FIELDS.map(f => (
            <label key={f} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={fields.includes(f)} onChange={() => toggleField(f)} /> {f}
            </label>
          ))}
        </div>
        <div className={styles.actions}><button onClick={gen}>Generate</button></div>
        {output && (
          <>
            <textarea className={styles.outputArea} readOnly value={output} style={{ minHeight: 300, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
            <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(output)}>Copy</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
