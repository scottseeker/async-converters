import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

export default function SkateboardWheelSpeed() {
  const [wheelDiam, setWheelDiam] = useState(60);
  const [pushesPerMin, setPushesPerMin] = useState(20);
  const [rolloutPerPush, setRolloutPerPush] = useState(3);

  const circumferenceM = Math.PI * (wheelDiam / 1000);
  const wheelRotationsPerMin = pushesPerMin * rolloutPerPush;
  const speedKmh = wheelRotationsPerMin * circumferenceM * 60 / 1000;
  const speedMph = speedKmh * 0.6214;
  const distPerPushM = circumferenceM * rolloutPerPush;

  return (
    <ConverterShell
      title="Skateboard Wheel Speed"
      description="Estimate skateboard speed from wheel size, push cadence, and wheel rotations per push."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Wheel Diameter (mm)</label>
            <input type="number" min={48} max={110}
              value={wheelDiam} onChange={e => setWheelDiam(Number(e.target.value))} />
            <span className={styles.hint}>Street: 50–54mm. Cruiser: 58–65mm. Longboard: 65–80mm+.</span>
          </div>
          <div className={styles.field}>
            <label>Pushes per Minute</label>
            <input type="number" min={5} max={80}
              value={pushesPerMin} onChange={e => setPushesPerMin(Number(e.target.value))} />
            <span className={styles.hint}>Casual: 10–15. Moderate: 20–30. Fast: 40+.</span>
          </div>
          <div className={styles.field}>
            <label>Wheel Rotations per Push</label>
            <input type="number" min={1} max={20} step={0.5}
              value={rolloutPerPush} onChange={e => setRolloutPerPush(Number(e.target.value))} />
            <span className={styles.hint}>Typical flat ground: 2–5 rotations per push.</span>
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Wheel Circumference</div>
            <div className={styles.resultValue}>{(circumferenceM * 1000).toFixed(0)}<span className={styles.resultUnit}>mm</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Distance per Push</div>
            <div className={styles.resultValue}>{distPerPushM.toFixed(2)}<span className={styles.resultUnit}>m</span></div>
          </div>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Estimated Speed</div>
            <div className={styles.resultValue}>{speedKmh.toFixed(1)}<span className={styles.resultUnit}>km/h</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Estimated Speed</div>
            <div className={styles.resultValue}>{speedMph.toFixed(1)}<span className={styles.resultUnit}>mph</span></div>
          </div>
        </div>

        <div className={styles.wheelCompare}>
          <div className={styles.compareTitle}>Wheel size comparison at same push cadence</div>
          {[50, 56, 60, 65, 70, 80].map(d => {
            const c = Math.PI * (d / 1000);
            const spd = pushesPerMin * rolloutPerPush * c * 60 / 1000;
            return (
              <div key={d} className={`${styles.compareRow} ${d === wheelDiam ? styles.compareActive : ''}`}>
                <span>{d}mm wheel</span>
                <span>{spd.toFixed(1)} km/h</span>
              </div>
            );
          })}
        </div>
      </div>
    </ConverterShell>
  );
}
