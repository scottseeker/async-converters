import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

function motorPower(speedKmh: number, mass: number, Crr: number, CdA: number): number {
  const v = speedKmh / 3.6;
  const rho = 1.225;
  const g = 9.81;
  return Crr * mass * g * v + 0.5 * CdA * rho * v * v * v;
}

export default function EBikePowerSpeed() {
  const [motorW, setMotorW] = useState(500);
  const [efficiency, setEfficiency] = useState(80);
  const [mass, setMass] = useState(90);
  const [vehicleType, setVehicleType] = useState<'scooter' | 'ebike'>('ebike');

  const CdA = vehicleType === 'scooter' ? 0.4 : 0.3;
  const Crr = vehicleType === 'scooter' ? 0.012 : 0.006;
  const availableW = motorW * (efficiency / 100);

  let topSpeedKmh = 0;
  for (let v = 1; v <= 120; v += 0.5) {
    if (motorPower(v, mass, Crr, CdA) <= availableW) {
      topSpeedKmh = v;
    } else {
      break;
    }
  }
  const topSpeedMph = topSpeedKmh * 0.6214;
  const speeds = [15, 20, 25, 30, 35, 40, 45];
  const powerAtSpeeds = speeds.map(s => ({ speed: s, power: motorPower(s, mass, Crr, CdA) }));

  return (
    <ConverterShell
      title="E-Bike Power & Speed"
      description="Estimate e-bike or e-scooter top speed from motor power, efficiency, and rider mass."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Motor Rated Power (W)</label>
            <input type="number" min={100} max={5000} step={50}
              value={motorW} onChange={e => setMotorW(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Motor + Drivetrain Efficiency (%)</label>
            <input type="number" min={60} max={98}
              value={efficiency} onChange={e => setEfficiency(Number(e.target.value))} />
            <span className={styles.hint}>Hub motor: 75–85%. Mid-drive: 80–90%.</span>
          </div>
          <div className={styles.field}>
            <label>Total Mass (kg)</label>
            <input type="number" min={30} max={250}
              value={mass} onChange={e => setMass(Number(e.target.value))} />
            <span className={styles.hint}>Rider + vehicle combined weight.</span>
          </div>
          <div className={styles.field}>
            <label>Vehicle Type</label>
            <select value={vehicleType} onChange={e => setVehicleType(e.target.value as 'scooter' | 'ebike')}>
              <option value="ebike">E-Bike (upright)</option>
              <option value="scooter">E-Scooter (standing)</option>
            </select>
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Available Mechanical Power</div>
            <div className={styles.resultValue}>{availableW.toFixed(0)}<span className={styles.resultUnit}>W</span></div>
          </div>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Estimated Top Speed</div>
            <div className={styles.resultValue}>{topSpeedKmh.toFixed(1)}<span className={styles.resultUnit}>km/h</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Estimated Top Speed</div>
            <div className={styles.resultValue}>{topSpeedMph.toFixed(1)}<span className={styles.resultUnit}>mph</span></div>
          </div>
        </div>

        <div className={styles.powerTable}>
          <div className={styles.tableTitle}>Power required at various speeds</div>
          <div className={styles.tableHeader}>
            <span>Speed (km/h)</span>
            <span>Power Required (W)</span>
            <span>Within Capacity?</span>
          </div>
          {powerAtSpeeds.map(row => (
            <div key={row.speed} className={`${styles.tableRow} ${row.power > availableW ? styles.overCapacity : ''}`}>
              <span>{row.speed} km/h</span>
              <span>{row.power.toFixed(0)} W</span>
              <span>{row.power <= availableW ? '✅ Yes' : '❌ No'}</span>
            </div>
          ))}
        </div>

        <div className={styles.note}>
          Model based on aerodynamic drag and rolling resistance only. Hill gradient is not included — a 5% grade roughly triples power demand at low speeds.
        </div>
      </div>
    </ConverterShell>
  );
}
