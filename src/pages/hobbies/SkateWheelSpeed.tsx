import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

const COMMON_WHEEL_SIZES = [59, 62, 72, 76, 80, 84, 90, 100, 110, 125];

export default function SkateWheelSpeed() {
  const [wheelDiam, setWheelDiam] = useState(80);
  const [stridesPerMin, setStridesPerMin] = useState(40);
  const [framesPerStride, setFramesPerStride] = useState(3);

  const circumferenceM = Math.PI * (wheelDiam / 1000);
  const rotationsPerMin = stridesPerMin * framesPerStride;
  const speedKmh = rotationsPerMin * circumferenceM * 60 / 1000;
  const speedMph = speedKmh * 0.6214;
  const distPerStrideM = circumferenceM * framesPerStride;

  return (
    <ConverterShell
      title="Inline Skate Wheel Speed"
      description="Calculate inline skating speed from wheel diameter, stride cadence, and glide distance per stride."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Wheel Diameter (mm)</label>
            <select value={wheelDiam} onChange={e => setWheelDiam(Number(e.target.value))}>
              {COMMON_WHEEL_SIZES.map(d => (
                <option key={d} value={d}>{d}mm</option>
              ))}
            </select>
            <span className={styles.hint}>Aggressive: 59–72mm. Fitness: 76–90mm. Speed: 100–125mm.</span>
          </div>
          <div className={styles.field}>
            <label>Strides per Minute</label>
            <input type="number" min={10} max={120}
              value={stridesPerMin} onChange={e => setStridesPerMin(Number(e.target.value))} />
            <span className={styles.hint}>Recreational: 30–45. Fast fitness: 55–70. Racing: 80+.</span>
          </div>
          <div className={styles.field}>
            <label>Wheel Rotations per Stride</label>
            <input type="number" min={1} max={15} step={0.5}
              value={framesPerStride} onChange={e => setFramesPerStride(Number(e.target.value))} />
            <span className={styles.hint}>Efficient glide: 3–6 rotations.</span>
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Wheel Circumference</div>
            <div className={styles.resultValue}>{(circumferenceM * 1000).toFixed(0)}<span className={styles.resultUnit}>mm</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Glide Distance per Stride</div>
            <div className={styles.resultValue}>{distPerStrideM.toFixed(2)}<span className={styles.resultUnit}>m</span></div>
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

        <div className={styles.sizeGuide}>
          <div className={styles.guideTitle}>Common wheel sizes — speed at {stridesPerMin} strides/min × {framesPerStride} rotations</div>
          {COMMON_WHEEL_SIZES.map(d => {
            const c = Math.PI * (d / 1000);
            const spd = stridesPerMin * framesPerStride * c * 60 / 1000;
            return (
              <div key={d} className={`${styles.guideRow} ${d === wheelDiam ? styles.guideActive : ''}`}>
                <span>{d}mm</span>
                <span>{spd.toFixed(1)} km/h</span>
              </div>
            );
          })}
        </div>
      </div>
    </ConverterShell>
  );
}
