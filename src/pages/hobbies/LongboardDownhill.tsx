import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

interface WheelCompound {
  label: string;
  crr: number;
  description: string;
}

const WHEEL_COMPOUNDS: WheelCompound[] = [
  { label: 'Soft race wheels (75–78a)',   crr: 0.008, description: 'Grippy thane, deforms well — lowest Crr on smooth asphalt' },
  { label: 'Medium downhill (80–83a)',    crr: 0.011, description: 'Balance of grip and slide control — most common for freeride' },
  { label: 'Hard freeride (84–87a)',      crr: 0.014, description: 'More predictable slide initiation; higher rolling resistance' },
  { label: 'Street/rough surface',        crr: 0.018, description: 'Hard wheels on rough pavement — significant rolling resistance' },
];

const RHO = 1.225;
const G   = 9.81;

export default function LongboardDownhill() {
  const [totalMassKg, setTotalMassKg] = useState(80);
  const [gradePercent, setGradePercent] = useState(10);
  const [wheelDiamMm, setWheelDiamMm] = useState(70);
  const [compoundIdx, setCompoundIdx] = useState(0);
  const [tucked, setTucked] = useState(false);

  const compound = WHEEL_COMPOUNDS[compoundIdx];
  const crr = compound.crr;
  const theta = Math.atan(gradePercent / 100);
  const frontalArea = tucked ? 0.22 : 0.50;
  const cd = tucked ? 0.5 : 0.8;

  const gravComponent = totalMassKg * G * Math.sin(theta);
  const rollComponent = crr * totalMassKg * G * Math.cos(theta);
  const dragCoeff = 0.5 * RHO * cd * frontalArea;
  const netForce = gravComponent - rollComponent;
  const vTermMs = netForce > 0 ? Math.sqrt(netForce / dragCoeff) : 0;
  const vTermKmh = vTermMs * 3.6;
  const vTermMph = vTermMs * 2.237;
  const dist90 = netForce > 0 ? (0.81 * vTermMs * vTermMs * totalMassKg) / (2 * netForce) : 0;
  const gradeAngleDeg = ((theta * 180) / Math.PI).toFixed(1);

  return (
    <ConverterShell
      title="Longboard Downhill Speed"
      description="Calculate terminal velocity for downhill longboarding based on hill grade, mass, wheel compound, and rider position."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Total Mass (kg)</label>
            <input type="number" min={40} max={160} step={1}
              value={totalMassKg} onChange={e => setTotalMassKg(Number(e.target.value))} />
            <span className={styles.hint}>Rider + board + gear. Board ~2–4 kg.</span>
          </div>
          <div className={styles.field}>
            <label>Hill Grade (%)</label>
            <input type="number" min={1} max={50} step={0.5}
              value={gradePercent} onChange={e => setGradePercent(Number(e.target.value))} />
            <span className={styles.hint}>
              {gradeAngleDeg}° angle. {gradePercent < 5 ? 'Gentle roll.' : gradePercent < 12 ? 'Moderate slope.' : gradePercent < 20 ? 'Steep — control required.' : 'Very steep — expert only.'}
            </span>
          </div>
          <div className={styles.field}>
            <label>Wheel Diameter (mm)</label>
            <input type="number" min={60} max={100} step={1}
              value={wheelDiamMm} onChange={e => setWheelDiamMm(Number(e.target.value))} />
            <span className={styles.hint}>Larger wheels roll faster and more smoothly over cracks.</span>
          </div>
          <div className={styles.field}>
            <label>Wheel Compound</label>
            <select value={compoundIdx} onChange={e => setCompoundIdx(Number(e.target.value))}>
              {WHEEL_COMPOUNDS.map((c, i) => (
                <option key={i} value={i}>{c.label}</option>
              ))}
            </select>
            <span className={styles.hint}>{compound.description}</span>
          </div>
          <div className={styles.field}>
            <label>Rider Position</label>
            <select value={tucked ? 'tucked' : 'upright'} onChange={e => setTucked(e.target.value === 'tucked')}>
              <option value="upright">Upright (standing)</option>
              <option value="tucked">Tuck (crouched low)</option>
            </select>
            <span className={styles.hint}>Tuck reduces frontal area from ~0.5 m² to ~0.22 m².</span>
          </div>
        </div>

        <div className={styles.results}>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Terminal Velocity</div>
            <div className={styles.resultValue}>
              {vTermMs > 0 ? vTermKmh.toFixed(1) : 'N/A'}
              {vTermMs > 0 && <span className={styles.resultUnit}>km/h</span>}
            </div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Terminal Velocity</div>
            <div className={styles.resultValue}>
              {vTermMs > 0 ? vTermMph.toFixed(1) : 'N/A'}
              {vTermMs > 0 && <span className={styles.resultUnit}>mph</span>}
            </div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Distance to 90% Terminal Speed</div>
            <div className={styles.resultValue}>
              {vTermMs > 0 ? `~${dist90.toFixed(0)}` : '—'}
              {vTermMs > 0 && <span className={styles.resultUnit}>m from standstill</span>}
            </div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Grade Angle</div>
            <div className={styles.resultValue}>{gradeAngleDeg}<span className={styles.resultUnit}>° from horizontal</span></div>
          </div>
        </div>

        <div className={styles.formula}>
          v_terminal = √( (m·g·sin θ − Crr·m·g·cos θ) / (½·ρ·Cd·A) )
          <br />
          Crr = {crr} | A = {frontalArea} m² | ρ = {RHO} kg/m³
        </div>

        {vTermKmh > 40 && (
          <p className={styles.note}>
            ⚠️ At speeds above 40 km/h, full protective gear (helmet, gloves, slide gloves, leathers) is strongly recommended.
          </p>
        )}
      </div>
    </ConverterShell>
  );
}
