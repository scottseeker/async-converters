import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

interface WheelConfig {
  label: string;
  durometer: number;
  crr: number;
  crrRough: number;
}

const WHEEL_CONFIGS: WheelConfig[] = [
  { label: 'Very soft (78A) — cruiser/longboard', durometer: 78,  crr: 0.010, crrRough: 0.008 },
  { label: 'Soft (87A) — hybrid/cruiser',         durometer: 87,  crr: 0.009, crrRough: 0.010 },
  { label: 'Medium (92A) — all-around',           durometer: 92,  crr: 0.007, crrRough: 0.012 },
  { label: 'Hard (97A) — street park',            durometer: 97,  crr: 0.005, crrRough: 0.016 },
  { label: 'Very hard (101A+) — street/technical',durometer: 101, crr: 0.004, crrRough: 0.022 },
];

export default function SkateboardRolling() {
  const [wheelIdx, setWheelIdx] = useState(3);
  const [mass, setMass] = useState(80);
  const [speedKmh, setSpeedKmh] = useState(15);
  const [surface, setSurface] = useState<'smooth' | 'rough'>('smooth');

  const cfg = WHEEL_CONFIGS[wheelIdx];
  const crr = surface === 'smooth' ? cfg.crr : cfg.crrRough;
  const g = 9.81;
  const v = speedKmh / 3.6;
  const rollingForceN = crr * mass * g;
  const rollingPowerW = rollingForceN * v;
  const decelerationMs2 = crr * g;
  const coastDistanceM = (v * v) / (2 * decelerationMs2);

  return (
    <ConverterShell
      title="Skateboard Rolling Resistance"
      description="Calculate rolling resistance force, power, and coasting distance for different skateboard wheel hardnesses."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Wheel Hardness</label>
            <select value={wheelIdx} onChange={e => setWheelIdx(Number(e.target.value))}>
              {WHEEL_CONFIGS.map((w, i) => (
                <option key={i} value={i}>{w.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Surface</label>
            <select value={surface} onChange={e => setSurface(e.target.value as 'smooth' | 'rough')}>
              <option value="smooth">Smooth concrete / polished</option>
              <option value="rough">Rough asphalt / paving</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Rider + Board Mass (kg)</label>
            <input type="number" min={30} max={150}
              value={mass} onChange={e => setMass(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Rolling Speed (km/h)</label>
            <input type="number" min={1} max={60}
              value={speedKmh} onChange={e => setSpeedKmh(Number(e.target.value))} />
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Rolling Resistance (Crr)</div>
            <div className={styles.resultValue}>{crr.toFixed(4)}</div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Rolling Resistance Force</div>
            <div className={styles.resultValue}>{rollingForceN.toFixed(1)}<span className={styles.resultUnit}>N</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Power to Overcome Rolling</div>
            <div className={styles.resultValue}>{rollingPowerW.toFixed(1)}<span className={styles.resultUnit}>W</span></div>
          </div>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Coasting Distance (flat)</div>
            <div className={styles.resultValue}>{coastDistanceM.toFixed(0)}<span className={styles.resultUnit}>m</span></div>
          </div>
        </div>

        <div className={styles.comparisonTable}>
          <div className={styles.compareTitle}>All wheel types — coasting distance at {speedKmh} km/h on {surface} surface</div>
          {WHEEL_CONFIGS.map((w, i) => {
            const c = surface === 'smooth' ? w.crr : w.crrRough;
            const dec = c * g;
            const dist = (v * v) / (2 * dec);
            return (
              <div key={i} className={`${styles.compareRow} ${i === wheelIdx ? styles.compareActive : ''}`}>
                <span>{w.label}</span>
                <span>{dist.toFixed(0)} m</span>
              </div>
            );
          })}
        </div>

        <div className={styles.note}>
          Coasting distance is theoretical on a flat, windless surface. Real values depend on bearing quality, wheel diameter, and surface micro-texture. Air resistance becomes significant above ~20 km/h.
        </div>
      </div>
    </ConverterShell>
  );
}
