import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './finance.module.css';

export default function PercentageCalculator() {
  const [xOf, setXOf] = useState({ x: '', y: '' });
  const [pctOf, setPctOf] = useState({ pct: '', total: '' });
  const [change, setChange] = useState({ from: '', to: '' });

  const r1 = xOf.x && xOf.y ? `${((parseFloat(xOf.x)/parseFloat(xOf.y))*100).toFixed(4)}%` : '';
  const r2 = pctOf.pct && pctOf.total ? `${((parseFloat(pctOf.pct)/100)*parseFloat(pctOf.total)).toFixed(4)}` : '';
  const r3 = change.from && change.to
    ? `${(((parseFloat(change.to)-parseFloat(change.from))/Math.abs(parseFloat(change.from)))*100).toFixed(4)}%`
    : '';

  return (
    <ConverterShell title="Percentage Calculator" description="Calculate percentages, ratios, and percent change." category="finance">
      <div className={styles.form}>
        <h3>What % is X of Y?</h3>
        <div className={styles.row}>
          <div className={styles.field}><label>X</label><input type="number" placeholder="e.g. 25" value={xOf.x} onChange={e => setXOf(p => ({...p, x: e.target.value}))} /></div>
          <div className={styles.field}><label>Y</label><input type="number" placeholder="e.g. 200" value={xOf.y} onChange={e => setXOf(p => ({...p, y: e.target.value}))} /></div>
        </div>
        {r1 && <div className={styles.resultBox}><div className={styles.resultLabel}>Result</div><div className={styles.resultValue}>{r1}</div></div>}

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

        <h3>What is P% of Y?</h3>
        <div className={styles.row}>
          <div className={styles.field}><label>Percent (%)</label><input type="number" placeholder="e.g. 15" value={pctOf.pct} onChange={e => setPctOf(p => ({...p, pct: e.target.value}))} /></div>
          <div className={styles.field}><label>Of</label><input type="number" placeholder="e.g. 200" value={pctOf.total} onChange={e => setPctOf(p => ({...p, total: e.target.value}))} /></div>
        </div>
        {r2 && <div className={styles.resultBox}><div className={styles.resultLabel}>Result</div><div className={styles.resultValue}>{r2}</div></div>}

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

        <h3>Percent change from A to B</h3>
        <div className={styles.row}>
          <div className={styles.field}><label>From</label><input type="number" placeholder="e.g. 100" value={change.from} onChange={e => setChange(p => ({...p, from: e.target.value}))} /></div>
          <div className={styles.field}><label>To</label><input type="number" placeholder="e.g. 125" value={change.to} onChange={e => setChange(p => ({...p, to: e.target.value}))} /></div>
        </div>
        {r3 && <div className={styles.resultBox}><div className={styles.resultLabel}>Change</div><div className={styles.resultValue}>{r3}</div></div>}
      </div>
    </ConverterShell>
  );
}
