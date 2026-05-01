import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './printing.module.css';

const PLA_DENSITY = 1.24; // g/cm³
const NOZZLE_WIDTH = 0.4; // mm (common default)

export default function PrintTimeEstimator() {
  const [volume, setVolume]     = useState<number | ''>(50);
  const [layerH, setLayerH]     = useState<number | ''>(0.2);
  const [speed, setSpeed]       = useState<number | ''>(50);
  const [infill, setInfill]     = useState<number | ''>(20);
  const [supports, setSupports] = useState(false);

  const vol    = Number(volume) || 0;
  const lh     = Number(layerH) || 0.2;
  const spd    = Number(speed) || 50;
  const inf    = Number(infill) || 20;

  // Simplified time model:
  // Effective travel volume accounting for infill density
  // time_minutes = (vol_cm3 * infill/100 * 1000mm3/cm3) / (speed_mm_s * 60 * NOZZLE_WIDTH * layerH_mm)
  // Plus perimeter multiplier (~2.5x for shells + top/bottom)
  const shellFactor = 2.5;
  const supportFactor = supports ? 1.3 : 1.0;
  const timeMinutes = vol > 0 && spd > 0 && lh > 0
    ? ((vol * (inf / 100) * 1000) / (spd * 60 * NOZZLE_WIDTH * lh)) * shellFactor * supportFactor
    : 0;

  // Weight estimate: approximate full-shell ratio is ~30% additional to infill volume
  const printedVol = vol * (inf / 100) * 1.3 * supportFactor;
  const weightG = printedVol * PLA_DENSITY;

  const hours = Math.floor(timeMinutes / 60);
  const mins  = Math.round(timeMinutes % 60);

  return (
    <ConverterShell
      title="Print Time Estimator"
      description="Rough estimate of FDM print time and filament weight from model volume and print settings."
      category="printing"
    >
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1, minWidth: 110 }}>
            <label>Model volume (cm³)</label>
            <input type="number" min={0} step={0.5} value={volume}
              onChange={e => setVolume(e.target.value === '' ? '' : Number(e.target.value))} />
            <span className={styles.hint}>From slicer → print info</span>
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 110 }}>
            <label>Layer height (mm)</label>
            <select value={layerH} onChange={e => setLayerH(Number(e.target.value))}>
              {[0.1, 0.15, 0.2, 0.25, 0.3].map(v => <option key={v} value={v}>{v} mm</option>)}
            </select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1, minWidth: 110 }}>
            <label>Print speed (mm/s)</label>
            <input type="number" min={1} step={5} value={speed}
              onChange={e => setSpeed(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 110 }}>
            <label>Infill (%)</label>
            <input type="number" min={0} max={100} step={5} value={infill}
              onChange={e => setInfill(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
        </div>
        <div className={styles.field}>
          <label>
            <input type="checkbox" checked={supports} onChange={e => setSupports(e.target.checked)} style={{ marginRight: '0.4rem' }} />
            Include supports (+30% time)
          </label>
        </div>

        {timeMinutes > 0 && (
          <div className={styles.grid}>
            <div className={`${styles.result} ${styles.resultHighlight}`}>
              <div className={styles.resultLabel}>Estimated Time</div>
              <div className={styles.resultValue}>
                {hours > 0 ? `${hours}h ` : ''}{mins}m
              </div>
            </div>
            <div className={styles.result}>
              <div className={styles.resultLabel}>Est. Weight (PLA)</div>
              <div className={styles.resultValue}>{weightG.toFixed(1)}<span className={styles.resultUnit}>g</span></div>
            </div>
            <div className={styles.result}>
              <div className={styles.resultLabel}>Infill density</div>
              <div className={styles.resultValue}>{infill}<span className={styles.resultUnit}>%</span></div>
            </div>
          </div>
        )}
        <div className={styles.hint}>
          ⚠ This is a rough estimate — actual time varies significantly by printer, slicer settings, cooling, and geometry. Use your slicer's estimate for accuracy.
        </div>
      </div>
    </ConverterShell>
  );
}
