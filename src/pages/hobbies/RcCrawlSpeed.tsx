import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

const VOLTAGE_OPTIONS = [
  { label: '7.4V — 2S LiPo',  value: 7.4  },
  { label: '11.1V — 3S LiPo', value: 11.1 },
  { label: '14.8V — 4S LiPo', value: 14.8 },
];

const REF_RATIOS = [30, 40, 50, 60, 80, 100];

export default function RcCrawlSpeed() {
  const [motorKv, setMotorKv] = useState(1200);
  const [voltage, setVoltage] = useState(7.4);
  const [finalRatio, setFinalRatio] = useState(60);
  const [wheelDiameterMm, setWheelDiameterMm] = useState(120);

  const wheelCircumferenceMm = Math.PI * wheelDiameterMm;
  const motorRpm = motorKv * voltage;
  const wheelRpm = motorRpm / finalRatio;
  const speedMPerMin = (wheelRpm * wheelCircumferenceMm) / 1000;
  const speedFtPerMin = speedMPerMin * 3.281;
  const secsPerMetre = speedMPerMin > 0 ? 60 / speedMPerMin : Infinity;

  return (
    <ConverterShell
      title="RC Crawl Speed"
      description="Calculate RC crawler speed at different final drive ratios to find your ideal crawling pace."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Motor KV</label>
            <input type="number" min={300} max={3000} step={100}
              value={motorKv} onChange={e => setMotorKv(Number(e.target.value))} />
            <span className={styles.hint}>Crawler motors: 900–1800KV typical. Lower = more torque.</span>
          </div>
          <div className={styles.field}>
            <label>Battery Voltage</label>
            <select value={voltage} onChange={e => setVoltage(Number(e.target.value))}>
              {VOLTAGE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Final Drive Ratio</label>
            <input type="number" min={10} max={200} step={1}
              value={finalRatio} onChange={e => setFinalRatio(Number(e.target.value))} />
            <span className={styles.hint}>Trans + transfer case + axle combined. Typical: 30–120:1.</span>
          </div>
          <div className={styles.field}>
            <label>Wheel Diameter (mm)</label>
            <input type="number" min={80} max={200} step={5}
              value={wheelDiameterMm} onChange={e => setWheelDiameterMm(Number(e.target.value))} />
            <span className={styles.hint}>Measure across the loaded tyre. Common: 100–140mm.</span>
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Motor RPM (no load)</div>
            <div className={styles.resultValue}>{Math.round(motorRpm).toLocaleString()}<span className={styles.resultUnit}>RPM</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Wheel RPM</div>
            <div className={styles.resultValue}>{wheelRpm.toFixed(1)}<span className={styles.resultUnit}>RPM</span></div>
          </div>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Crawl Speed</div>
            <div className={styles.resultValue}>{speedMPerMin.toFixed(2)}<span className={styles.resultUnit}>m/min</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Crawl Speed</div>
            <div className={styles.resultValue}>{speedFtPerMin.toFixed(2)}<span className={styles.resultUnit}>ft/min</span></div>
          </div>
          <div className={`${styles.result} ${secsPerMetre > 30 ? styles.resultHighlight : ''}`}>
            <div className={styles.resultLabel}>Seconds per Metre</div>
            <div className={styles.resultValue}>{secsPerMetre.toFixed(1)}<span className={styles.resultUnit}>s/m</span></div>
          </div>
        </div>

        <div className={styles.groupLabel} style={{ marginTop: 8 }}>Speed at different final ratios (same KV &amp; voltage)</div>
        <table className={styles.refTable}>
          <thead>
            <tr>
              <th>Final Ratio</th>
              <th>Wheel RPM</th>
              <th>m/min</th>
              <th>ft/min</th>
              <th>s/m</th>
            </tr>
          </thead>
          <tbody>
            {REF_RATIOS.map(r => {
              const wRpm = motorRpm / r;
              const spm = wRpm * wheelCircumferenceMm / 1000;
              const sftpm = spm * 3.281;
              const sm = spm > 0 ? 60 / spm : Infinity;
              return (
                <tr key={r} className={r === finalRatio ? styles.highlight : undefined}>
                  <td>{r}:1</td>
                  <td>{wRpm.toFixed(1)}</td>
                  <td>{spm.toFixed(2)}</td>
                  <td>{sftpm.toFixed(2)}</td>
                  <td>{sm.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className={styles.note}>
          All figures assume no-load motor RPM. Under load, actual speed is 10–25% lower. Use as a comparative guide when tuning final drive ratios.
        </div>
      </div>
    </ConverterShell>
  );
}
