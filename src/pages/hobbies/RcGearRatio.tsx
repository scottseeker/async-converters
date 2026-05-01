import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

export default function RcGearRatio() {
  const [pinion, setPinion] = useState(20);
  const [spur, setSpur] = useState(80);
  const [internalRatio, setInternalRatio] = useState(2.6);

  const externalRatio = spur / pinion;
  const finalRatio = externalRatio * internalRatio;

  return (
    <ConverterShell
      title="RC Gear Ratio Calculator"
      description="Calculate final drive ratio and torque multiplier for RC cars from pinion, spur, and internal ratio."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Pinion Teeth</label>
            <input type="number" min={10} max={60}
              value={pinion} onChange={e => setPinion(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Spur Teeth</label>
            <input type="number" min={40} max={120}
              value={spur} onChange={e => setSpur(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Internal (Transmission) Ratio</label>
            <input type="number" min={1} max={10} step={0.01}
              value={internalRatio} onChange={e => setInternalRatio(Number(e.target.value))} />
            <span className={styles.hint}>Typical range 2.5–3.5 for touring cars.</span>
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.result}>
            <div className={styles.resultLabel}>External Ratio</div>
            <div className={styles.resultValue}>{externalRatio.toFixed(2)}</div>
          </div>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Final Drive Ratio</div>
            <div className={styles.resultValue}>{finalRatio.toFixed(2)}</div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Torque Multiplier</div>
            <div className={styles.resultValue}>{finalRatio.toFixed(2)}×</div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Speed Reduction vs 1:1</div>
            <div className={styles.resultValue}>÷{finalRatio.toFixed(2)}</div>
          </div>
        </div>

        <div className={styles.note}>
          <strong>Interpretation:</strong> A final ratio of {finalRatio.toFixed(2)} means the motor turns {finalRatio.toFixed(2)} times
          for each wheel rotation. Higher ratios = more torque, lower top speed. Lower ratios = higher top speed, less torque and more motor heat.
        </div>
      </div>
    </ConverterShell>
  );
}
