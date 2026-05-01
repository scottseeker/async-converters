import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './gaming.module.css';

export default function DpiCalculator() {
  const [dpi, setDpi] = useState('');
  const [sens, setSens] = useState('');
  const [targetDpi, setTargetDpi] = useState('');

  const d = parseFloat(dpi);
  const s = parseFloat(sens);
  const td = parseFloat(targetDpi);
  const eDpi = !isNaN(d) && !isNaN(s) ? d * s : null;
  const newSens = eDpi !== null && !isNaN(td) && td > 0 ? (eDpi / td).toFixed(4) : null;

  return (
    <ConverterShell title="DPI Calculator" description="Calculate your effective DPI and convert sensitivity between DPI settings." category="gaming">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="dpi-val">Mouse DPI</label>
            <input id="dpi-val" type="number" min="100" step="100" placeholder="800" value={dpi} onChange={e => setDpi(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label htmlFor="dpi-sens">In-game Sensitivity</label>
            <input id="dpi-sens" type="number" min="0.01" step="0.01" placeholder="0.5" value={sens} onChange={e => setSens(e.target.value)} />
          </div>
        </div>
        {eDpi !== null && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}><div className={styles.statNum}>{eDpi.toFixed(0)}</div><div className={styles.statLabel}>Effective DPI</div></div>
            </div>
            <div className={styles.field}>
              <label htmlFor="dpi-tgt">Convert to DPI</label>
              <input id="dpi-tgt" type="number" min="100" step="100" placeholder="1600" value={targetDpi} onChange={e => setTargetDpi(e.target.value)} />
            </div>
            {newSens && (
              <div className={styles.stats}>
                <div className={styles.stat}><div className={styles.statNum}>{newSens}</div><div className={styles.statLabel}>New sensitivity at {targetDpi} DPI</div></div>
              </div>
            )}
          </>
        )}
      </div>
    </ConverterShell>
  );
}
