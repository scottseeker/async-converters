import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

const CONSUMPTION_PRESETS = [
  { label: 'Flat, light rider (10–12 Wh/km)',          value: 11 },
  { label: 'Mixed terrain, avg rider (15–18 Wh/km)',   value: 16 },
  { label: 'Hilly, heavy rider (22–28 Wh/km)',         value: 25 },
  { label: 'Custom',                                    value: 0  },
];

export default function EBikeRange() {
  const [voltage, setVoltage] = useState(36);
  const [ah, setAh] = useState(10);
  const [usablePct, setUsablePct] = useState(80);
  const [presetIndex, setPresetIndex] = useState(1);
  const [customConsumption, setCustomConsumption] = useState(16);

  const consumption = CONSUMPTION_PRESETS[presetIndex].value || customConsumption;
  const totalWh = voltage * ah;
  const usableWh = totalWh * (usablePct / 100);
  const rangeKm = usableWh / consumption;
  const rangeMiles = rangeKm * 0.6214;

  return (
    <ConverterShell
      title="E-Bike Range Estimator"
      description="Estimate electric bike or scooter range from battery voltage, capacity, and consumption profile."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Battery Voltage (V)</label>
            <select value={voltage} onChange={e => setVoltage(Number(e.target.value))}>
              <option value={24}>24V</option>
              <option value={36}>36V</option>
              <option value={48}>48V</option>
              <option value={52}>52V</option>
              <option value={60}>60V</option>
              <option value={72}>72V</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Capacity (Ah)</label>
            <input type="number" min={2} max={50} step={0.5}
              value={ah} onChange={e => setAh(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Usable Capacity (%)</label>
            <input type="number" min={50} max={100}
              value={usablePct} onChange={e => setUsablePct(Number(e.target.value))} />
            <span className={styles.hint}>80% preserves long-term battery health.</span>
          </div>
          <div className={styles.field}>
            <label>Consumption Profile</label>
            <select value={presetIndex} onChange={e => setPresetIndex(Number(e.target.value))}>
              {CONSUMPTION_PRESETS.map((p, i) => (
                <option key={i} value={i}>{p.label}</option>
              ))}
            </select>
          </div>
          {CONSUMPTION_PRESETS[presetIndex].value === 0 && (
            <div className={styles.field}>
              <label>Custom Consumption (Wh/km)</label>
              <input type="number" min={5} max={60} step={0.5}
                value={customConsumption} onChange={e => setCustomConsumption(Number(e.target.value))} />
            </div>
          )}
        </div>

        <div className={styles.results}>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Total Battery Capacity</div>
            <div className={styles.resultValue}>{totalWh.toFixed(0)}<span className={styles.resultUnit}>Wh</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Usable Capacity</div>
            <div className={styles.resultValue}>{usableWh.toFixed(0)}<span className={styles.resultUnit}>Wh</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Consumption Rate</div>
            <div className={styles.resultValue}>{consumption}<span className={styles.resultUnit}>Wh/km</span></div>
          </div>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Estimated Range</div>
            <div className={styles.resultValue}>{rangeKm.toFixed(1)}<span className={styles.resultUnit}>km</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Estimated Range</div>
            <div className={styles.resultValue}>{rangeMiles.toFixed(1)}<span className={styles.resultUnit}>miles</span></div>
          </div>
        </div>

        <div className={styles.note}>
          Real-world range depends heavily on rider weight, wind, tire pressure, and speed. Manufacturer range claims often use optimistic test conditions. Expect ±30% from estimates.
        </div>
      </div>
    </ConverterShell>
  );
}
