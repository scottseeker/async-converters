import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './printing.module.css';

const MATERIALS = [
  { name: 'PLA',   density: 1.24 },
  { name: 'PETG',  density: 1.27 },
  { name: 'ABS',   density: 1.04 },
  { name: 'TPU',   density: 1.21 },
  { name: 'ASA',   density: 1.07 },
  { name: 'Nylon', density: 1.14 },
  { name: 'Resin', density: 1.10 },
];

export default function FilamentCost() {
  const [material, setMaterial] = useState('PLA');
  const [weight, setWeight] = useState<number | ''>(50);
  const [spoolWeight, setSpoolWeight] = useState<number | ''>(1000);
  const [spoolPrice, setSpoolPrice] = useState<number | ''>(25);
  const [wastage, setWastage] = useState<number | ''>(5);

  const w = Number(weight) || 0;
  const sw = Number(spoolWeight) || 1000;
  const sp = Number(spoolPrice) || 0;
  const wst = Number(wastage) || 0;

  const costPerGram = sw > 0 ? sp / sw : 0;
  const printCost = (w / sw) * sp * (1 + wst / 100);
  const percentSpool = sw > 0 ? ((w / sw) * 100).toFixed(1) : '0';

  const mat = MATERIALS.find(m => m.name === material);
  const density = mat ? mat.density : 1.24;
  const weightFromVolume = (volume: number) => volume * density;
  void weightFromVolume; // suppress unused warning

  return (
    <ConverterShell
      title="Filament Cost Calculator"
      description="Calculate the material cost for a 3D print from filament weight and spool price."
      category="printing"
    >
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1, minWidth: 120 }}>
            <label>Material</label>
            <select value={material} onChange={e => setMaterial(e.target.value)}>
              {MATERIALS.map(m => <option key={m.name}>{m.name}</option>)}
            </select>
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Print weight (g)</label>
            <input type="number" min={0} step={0.1} value={weight}
              onChange={e => setWeight(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Spool weight (g)</label>
            <input type="number" min={1} value={spoolWeight}
              onChange={e => setSpoolWeight(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Spool price ($)</label>
            <input type="number" min={0} step={0.01} value={spoolPrice}
              onChange={e => setSpoolPrice(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Wastage / supports (%)</label>
            <input type="number" min={0} max={100} value={wastage}
              onChange={e => setWastage(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.result} ${styles.resultHighlight}`}>
            <div className={styles.resultLabel}>Print Cost</div>
            <div className={styles.resultValue}>${printCost.toFixed(2)}</div>
            <div className={styles.hint}>{percentSpool}% of spool</div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Cost per Gram</div>
            <div className={styles.resultValue}>${costPerGram.toFixed(4)}<span className={styles.resultUnit}>/g</span></div>
          </div>
          <div className={styles.result}>
            <div className={styles.resultLabel}>Material Density ({material})</div>
            <div className={styles.resultValue}>{density}<span className={styles.resultUnit}>g/cm³</span></div>
          </div>
        </div>
      </div>
    </ConverterShell>
  );
}
