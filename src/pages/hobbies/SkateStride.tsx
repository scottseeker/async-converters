import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

export default function SkateStride() {
  const [wheelDiam, setWheelDiam] = useState(80);
  const [stridesPerMin, setStridesPerMin] = useState(40);
  const [rotationsPerStride, setRotationsPerStride] = useState(3);
  const [targetKmh, setTargetKmh] = useState(20);

  const circumferenceM = Math.PI * (wheelDiam / 1000);
  const speedKmh = stridesPerMin * rotationsPerStride * circumferenceM * 60 / 1000;
  const speedMph = speedKmh * 0.6214;
  const requiredStridesPerMin = (targetKmh * 1000) / (rotationsPerStride * circumferenceM * 60);
  const isHighCadence = requiredStridesPerMin > 80;
  const isLowCadence = requiredStridesPerMin < 20;

  return (
    <ConverterShell
      title="Inline Skate Stride & Cadence"
      description="Calculate skating speed from stride cadence and find the cadence needed to hit a target speed."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Wheel Diameter (mm)</label>
            <input type="number" min={55} max={125}
              value={wheelDiam} onChange={e => setWheelDiam(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Wheel Rotations per Stride</label>
            <input type="number" min={1} max={15} step={0.5}
              value={rotationsPerStride} onChange={e => setRotationsPerStride(Number(e.target.value))} />
            <span className={styles.hint}>Efficient glide: 3–6.</span>
          </div>
          <div className={styles.field}>
            <label>Stride Cadence (strides/min)</label>
            <input type="number" min={10} max={120}
              value={stridesPerMin} onChange={e => setStridesPerMin(Number(e.target.value))} />
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Wheel Circumference</div>
            <div className={styles.resultValue}>{(circumferenceM * 1000).toFixed(0)}<span className={styles.resultUnit}>mm</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Glide per Stride</div>
            <div className={styles.resultValue}>{(circumferenceM * rotationsPerStride).toFixed(2)}<span className={styles.resultUnit}>m</span></div>
          </div>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Speed</div>
            <div className={styles.resultValue}>{speedKmh.toFixed(1)}<span className={styles.resultUnit}>km/h</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Speed</div>
            <div className={styles.resultValue}>{speedMph.toFixed(1)}<span className={styles.resultUnit}>mph</span></div>
          </div>
        </div>

        <div className={styles.reverseSection}>
          <div className={styles.reverseTitle}>Reverse: find required cadence for a target speed</div>
          <div className={styles.field}>
            <label>Target Speed (km/h)</label>
            <input type="number" min={1} max={60}
              value={targetKmh} onChange={e => setTargetKmh(Number(e.target.value))} />
          </div>
          <div className={styles.reverseResult}>
            Required cadence: <strong>{requiredStridesPerMin.toFixed(0)} strides/min</strong>
            {isHighCadence && <span className={styles.tag}>Very high — improve glide efficiency</span>}
            {isLowCadence && <span className={styles.tag}>Very low — increase stride power</span>}
            {!isHighCadence && !isLowCadence && <span className={styles.tag}>Achievable range</span>}
          </div>
        </div>
      </div>
    </ConverterShell>
  );
}
