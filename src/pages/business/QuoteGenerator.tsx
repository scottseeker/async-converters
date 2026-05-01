import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './business.module.css';

export default function QuoteGenerator() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [quoteNum, setQuoteNum] = useState('QTE-001');
  const [validDays, setValidDays] = useState('30');
  const [lines, setLines] = useState([{ desc: '', qty: '1', rate: '' }]);
  const [notes, setNotes] = useState('');

  const date = new Date().toISOString().slice(0, 10);
  const expiry = new Date(Date.now() + parseInt(validDays || '30') * 86400000).toISOString().slice(0, 10);

  function addLine() { setLines([...lines, { desc: '', qty: '1', rate: '' }]); }
  function updateLine(i: number, k: 'desc' | 'qty' | 'rate', v: string) {
    setLines(lines.map((l, idx) => idx === i ? { ...l, [k]: v } : l));
  }

  const total = lines.reduce((s, l) => s + (parseFloat(l.qty) || 0) * (parseFloat(l.rate) || 0), 0);

  function copyQuote() {
    const txt = [
      `QUOTE ${quoteNum}`, `Date: ${date}`, `Valid until: ${expiry}`,
      `From: ${from}`, `For: ${to}`, '',
      'Items:', ...lines.map(l => `  ${l.desc} | Qty: ${l.qty} × $${l.rate} = $${((parseFloat(l.qty)||0)*(parseFloat(l.rate)||0)).toFixed(2)}`),
      '', `ESTIMATED TOTAL: $${total.toFixed(2)}`,
      notes ? `\nNotes: ${notes}` : '',
    ].filter(x => x !== '').join('\n');
    navigator.clipboard.writeText(txt);
  }

  return (
    <ConverterShell title="Quote Generator" description="Generate a professional price quote with line items and expiry date." category="finance">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label>From</label>
            <input type="text" placeholder="Your Name / Company" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label>Prepared For</label>
            <input type="text" placeholder="Client Name" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Quote #</label>
            <input type="text" value={quoteNum} onChange={e => setQuoteNum(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Valid (days)</label>
            <input type="number" min="1" value={validDays} onChange={e => setValidDays(e.target.value)} />
          </div>
        </div>
        <div>
          {lines.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <input style={{ flex: 3, minWidth: 120 }} placeholder="Service/product description" value={l.desc} onChange={e => updateLine(i, 'desc', e.target.value)} />
              <input style={{ flex: 1, minWidth: 60 }} type="number" placeholder="Qty" value={l.qty} onChange={e => updateLine(i, 'qty', e.target.value)} />
              <input style={{ flex: 1, minWidth: 80 }} type="number" step="0.01" placeholder="Rate $" value={l.rate} onChange={e => updateLine(i, 'rate', e.target.value)} />
            </div>
          ))}
          <button onClick={addLine}>+ Add line</button>
        </div>
        <div className={styles.field}>
          <label>Notes / Terms</label>
          <input type="text" placeholder="Prices subject to change after expiry." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}><div className={styles.statNum}>${total.toFixed(2)}</div><div className={styles.statLabel}>Estimated Total</div></div>
          <div className={styles.stat}><div className={styles.statNum}>{expiry}</div><div className={styles.statLabel}>Valid until</div></div>
        </div>
        <div className={styles.actions}>
          <button onClick={copyQuote}>Copy Quote Text</button>
        </div>
      </div>
    </ConverterShell>
  );
}
