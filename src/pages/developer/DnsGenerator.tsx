import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'PTR', 'CAA'];

export default function DnsGenerator() {
  const [records, setRecords] = useState([
    { type: 'A', name: '@', value: '192.168.1.1', ttl: '3600', priority: '' },
    { type: 'MX', name: '@', value: 'mail.example.com', ttl: '3600', priority: '10' },
  ]);

  function addRecord() {
    setRecords(r => [...r, { type: 'A', name: '', value: '', ttl: '3600', priority: '' }]);
  }

  function update(i: number, key: string, val: string) {
    setRecords(r => r.map((rec, j) => j === i ? { ...rec, [key]: val } : rec));
  }

  function remove(i: number) { setRecords(r => r.filter((_, j) => j !== i)); }

  const zonefile = records
    .filter(r => r.name && r.value)
    .map(r => `${r.name.padEnd(20)} ${r.ttl.padEnd(8)} IN  ${r.type.padEnd(6)} ${r.priority ? r.priority + ' ' : ''}${r.value}`)
    .join('\n');

  return (
    <ConverterShell title="DNS Record Generator" description="Build DNS zone file records visually." category="developer">
      <div className={styles.form}>
        {records.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className={styles.field} style={{ width: 90 }}>
              {i === 0 && <label>Type</label>}
              <select value={r.type} onChange={e => update(i, 'type', e.target.value)}>
                {RECORD_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className={styles.field} style={{ flex: 1, minWidth: 80 }}>
              {i === 0 && <label>Name</label>}
              <input type="text" placeholder="@" value={r.name} onChange={e => update(i, 'name', e.target.value)} />
            </div>
            <div className={styles.field} style={{ flex: 2, minWidth: 140 }}>
              {i === 0 && <label>Value</label>}
              <input type="text" placeholder="192.168.1.1" value={r.value} onChange={e => update(i, 'value', e.target.value)} />
            </div>
            <div className={styles.field} style={{ width: 80 }}>
              {i === 0 && <label>TTL</label>}
              <input type="text" value={r.ttl} onChange={e => update(i, 'ttl', e.target.value)} />
            </div>
            {(r.type === 'MX' || r.type === 'SRV') && (
              <div className={styles.field} style={{ width: 60 }}>
                {i === 0 && <label>Prio</label>}
                <input type="number" min={0} value={r.priority} onChange={e => update(i, 'priority', e.target.value)} />
              </div>
            )}
            <button onClick={() => remove(i)} style={{ marginBottom: 4 }}>✕</button>
          </div>
        ))}
        <div className={styles.actions}><button onClick={addRecord}>+ Add Record</button></div>
        <div className={styles.field}>
          <label>Zone file preview</label>
          <textarea className={styles.outputArea} readOnly value={zonefile} style={{ minHeight: 150, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} />
        </div>
        <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(zonefile)}>Copy</button></div>
      </div>
    </ConverterShell>
  );
}
