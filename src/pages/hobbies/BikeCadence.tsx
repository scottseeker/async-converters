import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

export default function BikeCadence() {
  const [chainring, setChainring] = useState(50);
  const [cog, setCog] = useState(15);
  const [cadence, setCadence] = useState(90);
  const [wheelDiam, setWheelDiam] = useState(672);
  const [targetSpeed, setTargetSpeed] = useState(30);

  const ratio = chainring / cog;
  const circumferenceM = Math.PI * (wheelDiam / 1000);
  const devM = ratio * circumferenceM;
  const speedKmh = devM * cadence * 60 / 1000;
  const speedMph = speedKmh * 0.6214;
  const requiredCadence = (targetSpeed * 1000) / (devM * 60);

  return (
    <ConverterShell
      title="Bike Cadence & Speed"
      description="Calculate cycling speed from chainring, cog, wheel size, and cadence — plus reverse-find required cadence."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Chainring (teeth)</label>
            <input type="number" min={24} max={65}
              value={chainring} onChange={e => setChainring(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Cog (teeth)</label>
            <input type="number" min={9} max={52}
              value={cog} onChange={e => setCog(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Wheel Diameter (mm)</label>
            <input type="number" min={400} max={800}
              value={wheelDiam} onChange={e => setWheelDiam(Number(e.target.value))} />
            <span className={styles.hint}>700c + 25mm tire ≈ 672mm. 29" + 2.35" tire ≈ 740mm.</span>
          </div>
          <div className={styles.field}>
            <label>Cadence (RPM)</label>
            <input type="number" min={40} max={180}
              value={cadence} onChange={e => setCadence(Number(e.target.value))} />
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Development</div>
            <div className={styles.resultValue}>{devM.toFixed(2)}<span className={styles.resultUnit}>m / rev</span></div>
          </div>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Speed at Cadence</div>
            <div className={styles.resultValue}>{speedKmh.toFixed(1)}<span className={styles.resultUnit}>km/h</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Speed at Cadence</div>
            <div className={styles.resultValue}>{speedMph.toFixed(1)}<span className={styles.resultUnit}>mph</span></div>
          </div>
        </div>

        <div className={styles.reverseSection}>
          <div className={styles.reverseTitle}>Reverse: cadence needed for a target speed</div>
          <div className={styles.field}>
            <label>Target Speed (km/h)</label>
            <input type="number" min={5} max={80}
              value={targetSpeed} onChange={e => setTargetSpeed(Number(e.target.value))} />
          </div>
          <div className={styles.reverseResult}>
            Required cadence: <strong>{requiredCadence.toFixed(0)} RPM</strong>
            {requiredCadence < 60 && <span className={styles.warning}> — very low (grinding)</span>}
            {requiredCadence > 110 && <span className={styles.warning}> — very high (spinning)</span>}
            {requiredCadence >= 60 && requiredCadence <= 110 && <span className={styles.ok}> — efficient range</span>}
          </div>
        </div>
      </div>
    </ConverterShell>
  );
}
