import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

type SuspType = 'fork' | 'shock';

const IDEAL: Record<SuspType, { min: number; max: number; label: string }> = {
  fork:  { min: 15, max: 25, label: 'Fork ideal: 15–25%' },
  shock: { min: 25, max: 35, label: 'Rear shock ideal: 25–35%' },
};

export default function BikeSuspensionSag() {
  const [suspType, setSuspType] = useState<SuspType>('fork');
  const [travel, setTravel] = useState(140);
  const [sag, setSag] = useState(30);
  const [riderWeight, setRiderWeight] = useState(75);

  const sagPct = travel > 0 ? (sag / travel) * 100 : 0;
  const ideal = IDEAL[suspType];
  const isOk = sagPct >= ideal.min && sagPct <= ideal.max;
  const isTooLow = sagPct < ideal.min;

  const statusClass = isOk ? styles.statusOk : isTooLow ? styles.statusLow : styles.statusHigh;
  const fillClass   = isOk ? styles.sagBarFillOk : isTooLow ? styles.sagBarFillLow : styles.sagBarFillHigh;

  const statusTitle = isOk
    ? '✅ Sag is within ideal range'
    : isTooLow
    ? '⬆️ Sag is too low — suspension is too firm'
    : '⬇️ Sag is too high — suspension is too soft';

  const action = isOk
    ? `Your ${suspType === 'fork' ? 'fork' : 'rear shock'} sag of ${sagPct.toFixed(1)}% is within the ideal ${ideal.min}–${ideal.max}% range.`
    : isTooLow
    ? `Add more air or use a lighter spring. Target ${Math.round(travel * ideal.min / 100)}–${Math.round(travel * ideal.max / 100)} mm of sag.`
    : `Reduce air pressure or use a stiffer spring. Target ${Math.round(travel * ideal.min / 100)}–${Math.round(travel * ideal.max / 100)} mm of sag.`;

  const approxPsi = Math.round((riderWeight * 0.4) + (suspType === 'shock' ? 20 : 0));
  const fillPct = Math.min(sagPct, 60);

  return (
    <ConverterShell
      title="Suspension Sag Calculator"
      description="Calculate MTB suspension sag percentage and get air pressure guidance for fork and rear shock."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Suspension Type</label>
            <select value={suspType} onChange={e => setSuspType(e.target.value as SuspType)}>
              <option value="fork">Fork (front suspension)</option>
              <option value="shock">Rear shock</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Total Travel (mm)</label>
            <input type="number" min={80} max={240} step={10}
              value={travel} onChange={e => setTravel(Number(e.target.value))} />
            <span className={styles.hint}>Stamped on the stanchion or in the spec sheet.</span>
          </div>
          <div className={styles.field}>
            <label>Measured Sag (mm)</label>
            <input type="number" min={0} max={travel} step={1}
              value={sag} onChange={e => setSag(Number(e.target.value))} />
            <span className={styles.hint}>Sit on the bike in riding position; measure the O-ring travel.</span>
          </div>
          <div className={styles.field}>
            <label>Rider Weight (kg)</label>
            <input type="number" min={40} max={150} step={1}
              value={riderWeight} onChange={e => setRiderWeight(Number(e.target.value))} />
            <span className={styles.hint}>Include riding gear (~2–3 kg).</span>
          </div>
        </div>

        <div className={styles.results}>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Sag Percentage</div>
            <div className={styles.resultValue}>{sagPct.toFixed(1)}<span className={styles.resultUnit}>%</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Ideal Range</div>
            <div className={styles.resultValue}>{ideal.min}–{ideal.max}<span className={styles.resultUnit}>%</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Starting Air Pressure</div>
            <div className={styles.resultValue}>~{approxPsi}<span className={styles.resultUnit}>psi</span></div>
          </div>
        </div>

        <div style={{ marginTop: 8, marginBottom: 24 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>
            Sag position within travel (0% = no sag, 60% shown as max)
          </div>
          <div className={styles.sagBar}>
            <div
              className={styles.sagBarIdeal}
              style={{
                left: `${(ideal.min / 60) * 100}%`,
                width: `${((ideal.max - ideal.min) / 60) * 100}%`,
              }}
            />
            <div
              className={`${styles.sagBarFill} ${fillClass}`}
              style={{ width: `${(fillPct / 60) * 100}%` }}
            />
            <span className={styles.sagBarLabel}>{sagPct.toFixed(1)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            <span>0%</span>
            <span style={{ color: '#4ade80' }}>Ideal: {ideal.min}–{ideal.max}%</span>
            <span>60%+</span>
          </div>
        </div>

        <div className={`${styles.statusCard} ${statusClass}`}>
          <div className={styles.statusTitle}>{statusTitle}</div>
          <div>{action}</div>
        </div>

        <p className={styles.note}>
          Measure sag with the O-ring method: push the rubber O-ring (or zip tie) to the seal, sit on the bike, stand up, and read the distance the O-ring moved. Repeat 3 times and average.
        </p>
      </div>
    </ConverterShell>
  );
}
