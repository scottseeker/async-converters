import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './business.module.css';

interface LineItem { desc: string; qty: string; rate: string; }

export default function InvoiceGenerator() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [invoiceNum, setInvoiceNum] = useState('INV-001');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [lines, setLines] = useState<LineItem[]>([{ desc: '', qty: '1', rate: '' }]);
  const [tax, setTax] = useState('0');
  const [notes, setNotes] = useState('');

  function addLine() { setLines([...lines, { desc: '', qty: '1', rate: '' }]); }
  function updateLine(i: number, k: keyof LineItem, v: string) {
    setLines(lines.map((l, idx) => idx === i ? { ...l, [k]: v } : l));
  }
  function removeLine(i: number) { setLines(lines.filter((_, idx) => idx !== i)); }

  const subtotal = lines.reduce((sum, l) => {
    const q = parseFloat(l.qty) || 0;
    const r = parseFloat(l.rate) || 0;
    return sum + q * r;
  }, 0);
  const taxAmt = subtotal * (parseFloat(tax) / 100 || 0);
  const total = subtotal + taxAmt;

  function copyText() {
    const txt = [
      `INVOICE ${invoiceNum}`, `Date: ${date}`,
      `From: ${from}`, `To: ${to}`, '',
      'Items:', ...lines.map(l => `  ${l.desc} | Qty: ${l.qty} × $${l.rate} = $${((parseFloat(l.qty)||0)*(parseFloat(l.rate)||0)).toFixed(2)}`),
      '', `Subtotal: $${subtotal.toFixed(2)}`,
      parseFloat(tax) > 0 ? `Tax (${tax}%): $${taxAmt.toFixed(2)}` : '',
      `TOTAL: $${total.toFixed(2)}`,
      notes ? `\nNotes: ${notes}` : '',
    ].filter(x => x !== '').join('\n');
    navigator.clipboard.writeText(txt);
  }

  return (
    <ConverterShell title="Invoice Generator" description="Generate a simple text invoice with line items, tax, and totals." category="finance">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label>From (your business)</label>
            <input type="text" placeholder="Your Name / Company" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label>Bill To</label>
            <input type="text" placeholder="Client Name" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label>Invoice #</label>
            <input type="text" value={invoiceNum} onChange={e => setInvoiceNum(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>
        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Line Items</label>
          {lines.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <input style={{ flex: 3, minWidth: 120 }} placeholder="Description" value={l.desc} onChange={e => updateLine(i, 'desc', e.target.value)} />
              <input style={{ flex: 1, minWidth: 60 }} type="number" min="0" placeholder="Qty" value={l.qty} onChange={e => updateLine(i, 'qty', e.target.value)} />
              <input style={{ flex: 1, minWidth: 80 }} type="number" min="0" step="0.01" placeholder="Rate $" value={l.rate} onChange={e => updateLine(i, 'rate', e.target.value)} />
              <span style={{ display: 'flex', alignItems: 'center', minWidth: 70, fontSize: '0.875rem' }}>${((parseFloat(l.qty)||0)*(parseFloat(l.rate)||0)).toFixed(2)}</span>
              <button onClick={() => removeLine(i)} disabled={lines.length === 1}>✕</button>
            </div>
          ))}
          <button onClick={addLine}>+ Add line</button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label>Tax (%)</label>
            <input type="number" min="0" step="0.1" value={tax} onChange={e => setTax(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 3 }}>
            <label>Notes</label>
            <input type="text" placeholder="Payment due in 30 days" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}><div className={styles.statNum}>${subtotal.toFixed(2)}</div><div className={styles.statLabel}>Subtotal</div></div>
          <div className={styles.stat}><div className={styles.statNum}>${taxAmt.toFixed(2)}</div><div className={styles.statLabel}>Tax</div></div>
          <div className={styles.stat}><div className={styles.statNum}>${total.toFixed(2)}</div><div className={styles.statLabel}>Total</div></div>
        </div>
        <div className={styles.actions}>
          <button onClick={copyText}>Copy Invoice Text</button>
        </div>
      </div>
    </ConverterShell>
  );
}
