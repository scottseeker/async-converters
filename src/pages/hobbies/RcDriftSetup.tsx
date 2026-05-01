import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

interface TireCompound {
  label: string;
  friction: number;
  driftEase: string;
  bestFor: string;
}

const TIRE_COMPOUNDS: TireCompound[] = [
  { label: 'Hard plastic drift tires (stock ABS/PVC)', friction: 0.15, driftEase: 'Very easy', bestFor: 'Beginners, smooth floors' },
  { label: 'Medium drift tires (harder rubber)',        friction: 0.30, driftEase: 'Easy',      bestFor: 'Smooth concrete, carpet rooms' },
  { label: 'Soft rubber drift tires',                  friction: 0.55, driftEase: 'Moderate',  bestFor: 'Asphalt, textured surfaces' },
  { label: 'Grip tires (touring car rubber)',           friction: 0.85, driftEase: 'Hard',      bestFor: 'Circuit racing, not drift' },
];

const GYRO_GAIN_GUIDE = [
  { range: '0–20%',  feel: 'No counter-steer assist — pure driver input. Unstable at high angle.' },
  { range: '20–40%', feel: 'Light assist. Good for experienced drivers who want full control.' },
  { range: '40–60%', feel: 'Moderate assist. Most common for intermediate builds and varied surfaces.' },
  { range: '60–75%', feel: 'Strong assist. Helps hold angle on slippery surfaces. Can feel mechanical.' },
  { range: '75%+',   feel: 'Oscillation risk. Car may "hunt" and wiggle — reduce if steering oscillates.' },
];

export default function RcDriftSetup() {
  const [gyroGain, setGyroGain] = useState(50);
  const [steeringAngle, setSteeringAngle] = useState(35);
  const [compoundIdx, setCompoundIdx] = useState(0);
  const [motorKv, setMotorKv] = useState(10500);
  const [voltage, setVoltage] = useState(7.4);
  const [finalRatio, setFinalRatio] = useState(6.5);

  const compound = TIRE_COMPOUNDS[compoundIdx];
  const motorRpm = motorKv * voltage;
  const wheelRpm = motorRpm / finalRatio;
  const slipPotential = (1 - compound.friction) * 100;
  const counterSteerNeeded = Math.round(steeringAngle * compound.friction * 0.6);
  const gyroZone =
    gyroGain < 20 ? 'No assist' :
    gyroGain < 40 ? 'Light assist' :
    gyroGain < 60 ? 'Moderate assist' :
    gyroGain < 75 ? 'Strong assist' :
    'Oscillation risk — try reducing gain';
  const gyroWarning = gyroGain >= 75;

  return (
    <ConverterShell
      title="RC Drift Setup"
      description="Guide your RC drift car setup: gyro gain, tire compound selection, and motor spin characteristics."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.groupLabel}>Motor &amp; Power</div>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Motor KV</label>
            <input type="number" min={3000} max={21500} step={500}
              value={motorKv} onChange={e => setMotorKv(Number(e.target.value))} />
            <span className={styles.hint}>Drift builds typically 10500–17500KV on 2S.</span>
          </div>
          <div className={styles.field}>
            <label>Battery Voltage (V)</label>
            <select value={voltage} onChange={e => setVoltage(Number(e.target.value))}>
              <option value={7.4}>7.4V — 2S LiPo</option>
              <option value={8.4}>8.4V — 2S fully charged</option>
              <option value={11.1}>11.1V — 3S LiPo</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Final Drive Ratio</label>
            <input type="number" min={3} max={15} step={0.1}
              value={finalRatio} onChange={e => setFinalRatio(Number(e.target.value))} />
            <span className={styles.hint}>Typical drift build: 5.5–8.</span>
          </div>
        </div>

        <div className={styles.groupLabel} style={{ marginTop: 16 }}>Chassis &amp; Handling Setup</div>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Steering Lock / Angle (°)</label>
            <input type="number" min={20} max={60}
              value={steeringAngle} onChange={e => setSteeringAngle(Number(e.target.value))} />
            <span className={styles.hint}>Most drift builds run 35–50°.</span>
          </div>
          <div className={styles.field}>
            <label>Tire Compound</label>
            <select value={compoundIdx} onChange={e => setCompoundIdx(Number(e.target.value))}>
              {TIRE_COMPOUNDS.map((t, i) => (
                <option key={i} value={i}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.groupLabel} style={{ marginTop: 16 }}>Gyro / Stability Control</div>
        <div className={styles.field}>
          <label>Gyro Gain: {gyroGain}%</label>
          <input type="range" className={styles.rangeInput} min={0} max={100}
            value={gyroGain} onChange={e => setGyroGain(Number(e.target.value))} />
        </div>

        <div className={styles.results}>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Motor RPM (no load)</div>
            <div className={styles.resultValue}>{motorRpm.toLocaleString()}<span className={styles.resultUnit}>RPM</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Wheel RPM</div>
            <div className={styles.resultValue}>{wheelRpm.toFixed(0)}<span className={styles.resultUnit}>RPM</span></div>
          </div>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Tire Slip Potential</div>
            <div className={styles.resultValue}>{slipPotential.toFixed(0)}<span className={styles.resultUnit}>%</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Drift Ease</div>
            <div className={styles.resultValue}>{compound.driftEase}</div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Counter-Steer Needed</div>
            <div className={styles.resultValue}>~{counterSteerNeeded}°</div>
          </div>
          <div className={`${styles.result} ${gyroWarning ? styles.resultHighlight : ''}`}>
            <div className={styles.resultLabel}>Gyro Zone</div>
            <div className={styles.resultValue}>{gyroZone}</div>
          </div>
        </div>

        <div className={styles.driftBlock}>
          <div className={styles.driftBlockTitle}>Tire compound comparison</div>
          {TIRE_COMPOUNDS.map((t, i) => (
            <div key={i} className={`${styles.driftRow} ${i === compoundIdx ? styles.driftRowActive : ''}`}>
              <span className={styles.driftRowLabel}>{t.label}</span>
              <span className={styles.driftRowTag}>{t.driftEase}</span>
              <span className={styles.driftRowNote}>{t.bestFor}</span>
            </div>
          ))}
        </div>

        <div className={styles.driftBlock}>
          <div className={styles.driftBlockTitle}>Gyro gain reference</div>
          {GYRO_GAIN_GUIDE.map((g, i) => {
            const parts = g.range.replace('%', '').split('–').map(Number);
            const lo = parts[0];
            const hi = parts[1];
            const active = gyroGain >= lo && (isNaN(hi) ? true : gyroGain < hi);
            return (
              <div key={i} className={`${styles.driftRow} ${active ? styles.driftRowActive : ''}`}>
                <span className={styles.driftRowLabel}>{g.range}</span>
                <span className={styles.driftRowNote}>{g.feel}</span>
              </div>
            );
          })}
        </div>

        <div className={styles.note}>
          Gyro gain is highly surface- and speed-dependent. Start at 40–50%, drive, then adjust in 5% increments. Oscillation (steering hunting left-right at rest) means gain is too high.
        </div>
      </div>
    </ConverterShell>
  );
}
