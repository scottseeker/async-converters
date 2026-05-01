import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './hobbies.module.css';

const WHEEL_SIZES = [
  { label: '700c (622mm bead)',        etrto: 622, addTire: 50  },
  { label: '29" / 700c MTB (622mm)',   etrto: 622, addTire: 110 },
  { label: '27.5" / 650b (584mm)',     etrto: 584, addTire: 100 },
  { label: '26" (559mm)',              etrto: 559, addTire: 100 },
  { label: '24" (507mm)',              etrto: 507, addTire: 60  },
  { label: '20" BMX/folding (406mm)',  etrto: 406, addTire: 60  },
];

export default function BikeGearInches() {
  const [chainring, setChainring] = useState(50);
  const [cog, setCog] = useState(15);
  const [wheelIdx, setWheelIdx] = useState(0);
  const [tireWidthMm, setTireWidthMm] = useState(25);

  const wheelPreset = WHEEL_SIZES[wheelIdx];
  const wheelDiamMm = wheelPreset.etrto + tireWidthMm * 2;
  const wheelDiamInch = wheelDiamMm / 25.4;
  const gearInches = (chainring / cog) * wheelDiamInch;
  const developmentM = (chainring / cog) * (Math.PI * wheelDiamMm / 1000);
  const ratio = chainring / cog;

  return (
    <ConverterShell
      title="Bike Gear Inches"
      description="Calculate gear inches and development for any bicycle gear combination and wheel size."
      category="hobbies"
    >
      <div className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Chainring (teeth)</label>
            <input type="number" min={24} max={65}
              value={chainring} onChange={e => setChainring(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Cog / Sprocket (teeth)</label>
            <input type="number" min={9} max={52}
              value={cog} onChange={e => setCog(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>Wheel Size</label>
            <select value={wheelIdx} onChange={e => setWheelIdx(Number(e.target.value))}>
              {WHEEL_SIZES.map((w, i) => (
                <option key={i} value={i}>{w.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Tire Width (mm)</label>
            <input type="number" min={20} max={100}
              value={tireWidthMm} onChange={e => setTireWidthMm(Number(e.target.value))} />
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Gear Ratio</div>
            <div className={styles.resultValue}>{ratio.toFixed(2)}</div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Effective Wheel Diameter</div>
            <div className={styles.resultValue}>{wheelDiamMm.toFixed(0)}<span className={styles.resultUnit}>mm</span></div>
          </div>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Gear Inches</div>
            <div className={styles.resultValue}>{gearInches.toFixed(1)}<span className={styles.resultUnit}>"</span></div>
          </div>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Development</div>
            <div className={styles.resultValue}>{developmentM.toFixed(2)}<span className={styles.resultUnit}>m / pedal rev</span></div>
          </div>
        </div>

        <div className={styles.rangeGuide}>
          <div className={styles.rangeTitle}>Gear Range Reference</div>
          <div className={styles.rangeRow}><span>Very easy (climbing)</span><span>20–40"</span></div>
          <div className={styles.rangeRow}><span>Easy (hills)</span><span>40–60"</span></div>
          <div className={styles.rangeRow}><span>Moderate (all-round)</span><span>60–80"</span></div>
          <div className={styles.rangeRow}><span>Hard (fast road)</span><span>80–100"</span></div>
          <div className={styles.rangeRow}><span>Very hard (sprint)</span><span>100–130"</span></div>
          <div className={`${styles.rangeRow} ${styles.rangeHighlight}`}>
            <span>Your selected gear</span><span>{gearInches.toFixed(1)}"</span>
          </div>
        </div>
      </div>
    </ConverterShell>
  );
}
