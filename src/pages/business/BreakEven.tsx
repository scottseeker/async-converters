import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './business.module.css';

export default function BreakEven() {
  const [fixed, setFixed] = useState('');
  const [price, setPrice] = useState('');
  const [varCost, setVarCost] = useState('');

  const f = parseFloat(fixed);
  const p = parseFloat(price);
  const v = parseFloat(varCost);
  const contrib = !isNaN(p) && !isNaN(v) ? p - v : null;
  const units = contrib !== null && contrib > 0 && !isNaN(f) ? Math.ceil(f / contrib) : null;
  const revenue = units !== null ? (units * p).toFixed(2) : null;

  return (
    <ConverterShell title="Break-Even Calculator" description="Find how many units you need to sell to cover your costs." category="finance">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="be-fixed">Fixed Costs ($)</label>
            <input id="be-fixed" type="number" min="0" step="0.01" placeholder="5000.00" value={fixed} onChange={e => setFixed(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="be-price">Selling Price ($)</label>
            <input id="be-price" type="number" min="0" step="0.01" placeholder="29.99" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="be-var">Variable Cost / unit ($)</label>
            <input id="be-var" type="number" min="0" step="0.01" placeholder="12.00" value={varCost} onChange={e => setVarCost(e.target.value)} />
          </div>
        </div>
        {units !== null && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>{units}</div><div className={styles.statLabel}>Units to break even</div></div>
            <div className={styles.stat}><div className={styles.statNum}>${revenue}</div><div className={styles.statLabel}>Break-even revenue</div></div>
            <div className={styles.stat}><div className={styles.statNum}>${contrib?.toFixed(2)}</div><div className={styles.statLabel}>Contribution margin</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
