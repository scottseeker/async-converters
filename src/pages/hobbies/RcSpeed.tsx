import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

function calcSpeed(kv: number, voltage: number, pinion: number, spur: number, internalRatio: number, wheelDiameterMm: number) {
  const finalRatio = (spur / pinion) * internalRatio;
  const motorRpm = kv * voltage;
  const wheelRpm = motorRpm / finalRatio;
  const wheelCircumferenceM = Math.PI * (wheelDiameterMm / 1000);
  const speedMs = (wheelRpm * wheelCircumferenceM) / 60;
  const speedKmh = speedMs * 3.6;
  const speedMph = speedMs * 2.237;
  return { motorRpm, wheelRpm, finalRatio, speedKmh, speedMph };
}

export default function RcSpeed() {
  const [kv, setKv] = useState(3500);
  const [voltage, setVoltage] = useState(7.4);
  const [pinion, setPinion] = useState(20);
  const [spur, setSpur] = useState(80);
  const [internalRatio, setInternalRatio] = useState(2.6);
  const [wheelDiameter, setWheelDiameter] = useState(68);

  const { motorRpm, wheelRpm, finalRatio, speedKmh, speedMph } = calcSpeed(kv, voltage, pinion, spur, internalRatio, wheelDiameter);

  return (
    <ConverterShell
      title="RC Speed Estimator"
      description="Estimate RC car theoretical top speed from motor KV, battery voltage, gear ratio, and wheel diameter."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Motor KV</label>
            <input type="number" min={500} max={15000} step={100}
              value={kv} onChange={e => setKv(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Battery Voltage (V)</label>
            <select value={voltage} onChange={e => setVoltage(Number(e.target.value))}>
              <option value={3.7}>1S LiPo (3.7V nominal)</option>
              <option value={7.4}>2S LiPo (7.4V nominal)</option>
              <option value={11.1}>3S LiPo (11.1V nominal)</option>
              <option value={14.8}>4S LiPo (14.8V nominal)</option>
              <option value={18.5}>5S LiPo (18.5V nominal)</option>
              <option value={22.2}>6S LiPo (22.2V nominal)</option>
            </select>
          </div>
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
            <label>Internal Ratio</label>
            <input type="number" min={1} max={10} step={0.01}
              value={internalRatio} onChange={e => setInternalRatio(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Wheel Diameter (mm)</label>
            <input type="number" min={20} max={200}
              value={wheelDiameter} onChange={e => setWheelDiameter(Number(e.target.value))} />
            <span className={styles.hint}>Typical: 60–70mm touring, 100–120mm 1/10 SC/buggy</span>
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Motor RPM (no-load)</div>
            <div className={styles.resultValue}>{Math.round(motorRpm).toLocaleString()}<span className={styles.resultUnit}>RPM</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Final Drive Ratio</div>
            <div className={styles.resultValue}>{finalRatio.toFixed(2)}</div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Wheel RPM</div>
            <div className={styles.resultValue}>{Math.round(wheelRpm).toLocaleString()}<span className={styles.resultUnit}>RPM</span></div>
          </div>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Theoretical Top Speed</div>
            <div className={styles.resultValue}>{speedKmh.toFixed(1)}<span className={styles.resultUnit}>km/h</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Theoretical Top Speed</div>
            <div className={styles.resultValue}>{speedMph.toFixed(1)}<span className={styles.resultUnit}>mph</span></div>
          </div>
        </div>

        <div className={styles.note}>
          <strong>Note:</strong> This is the no-load theoretical speed. Real-world speed is typically 70–85% of this value due to motor losses, drivetrain friction, and rolling resistance.
        </div>
      </div>
    </ConverterShell>
  );
}
