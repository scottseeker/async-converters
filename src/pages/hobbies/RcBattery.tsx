import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

export default function RcBattery() {
  const [capacity, setCapacity] = useState(5000);
  const [avgCurrent, setAvgCurrent] = useState(20);
  const [usablePct, setUsablePct] = useState(80);

  const usableMah = capacity * (usablePct / 100);
  const runtimeMin = (usableMah / 1000) / avgCurrent * 60;
  const runtimeSec = runtimeMin * 60;

  return (
    <ConverterShell
      title="RC Battery Runtime"
      description="Estimate RC battery runtime based on capacity, average current draw, and usable capacity percentage."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Battery Capacity (mAh)</label>
            <input type="number" min={500} max={20000} step={100}
              value={capacity} onChange={e => setCapacity(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Average Current Draw (A)</label>
            <input type="number" min={1} max={200} step={0.5}
              value={avgCurrent} onChange={e => setAvgCurrent(Number(e.target.value))} />
            <span className={styles.hint}>Bashing: 15–30A. Racing: 30–60A. Crawling: 5–15A.</span>
          </div>
          <div className={styles.field}>
            <label>Usable Capacity (%)</label>
            <input type="number" min={50} max={100}
              value={usablePct} onChange={e => setUsablePct(Number(e.target.value))} />
            <span className={styles.hint}>80% preserves battery life. 100% drains to cutoff.</span>
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Usable Capacity</div>
            <div className={styles.resultValue}>{usableMah.toFixed(0)}<span className={styles.resultUnit}>mAh</span></div>
          </div>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Estimated Runtime</div>
            <div className={styles.resultValue}>{runtimeMin.toFixed(1)}<span className={styles.resultUnit}>min</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Estimated Runtime</div>
            <div className={styles.resultValue}>{runtimeSec.toFixed(0)}<span className={styles.resultUnit}>sec</span></div>
          </div>
        </div>

        <div className={styles.note}>
          <strong>Formula:</strong> Runtime (min) = (Capacity mAh ÷ 1000 × Usable%) ÷ Average Current (A) × 60
        </div>
      </div>
    </ConverterShell>
  );
}
