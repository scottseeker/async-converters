import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './printing.module.css';

type FitType = 'snug' | 'normal' | 'loose' | 'press';

const FIT_OFFSETS: Record<FitType, { holeOffset: number; label: string; desc: string }> = {
  snug:   { holeOffset: -0.1, label: 'Snug Fit',   desc: 'Tight fit — insert with light push' },
  normal: { holeOffset: -0.2, label: 'Normal Fit',  desc: 'Standard clearance — slides in easily' },
  loose:  { holeOffset: -0.4, label: 'Loose Fit',   desc: 'Loose clearance — moves freely' },
  press:  { holeOffset: -0.2, label: 'Press Fit',   desc: 'Interference fit — requires force / heat' },
};

export default function ToleranceFit() {
  const [nominal, setNominal] = useState<number | ''>(10);
  const [fitType, setFitType] = useState<FitType>('normal');

  const nom = Number(nominal) || 0;
  const { holeOffset, desc } = FIT_OFFSETS[fitType];

  // For press fit: shaft is larger than nominal by 0.05mm (shaft = nominal + 0.05)
  const holeDiameter = fitType === 'press' ? nom + holeOffset : nom - Math.abs(holeOffset);
  const shaftDiameter = fitType === 'press' ? nom + 0.05 : nom;
  const clearance = holeDiameter - shaftDiameter;

  return (
    <ConverterShell
      title="Tolerance & Fit Calculator"
      description="Calculate hole and shaft diameters for FDM 3D printing tolerances and fit types."
      category="printing"
    >
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1, minWidth: 130 }}>
            <label>Nominal diameter (mm)</label>
            <input type="number" min={0.1} step={0.1} value={nominal}
              onChange={e => setNominal(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
        </div>
        <div className={styles.row}>
          {(Object.keys(FIT_OFFSETS) as FitType[]).map(ft => (
            <button key={ft}
              style={{ fontWeight: ft === fitType ? 700 : undefined,
                       borderColor: ft === fitType ? 'var(--accent)' : undefined }}
              onClick={() => setFitType(ft)}>
              {FIT_OFFSETS[ft].label}
            </button>
          ))}
        </div>
        <div className={styles.hint}>{desc}</div>

        {nom > 0 && (
          <div className={styles.grid}>
            <div className={`${styles.result} ${styles.resultHighlight}`}>
              <div className={styles.resultLabel}>Hole Diameter</div>
              <div className={styles.resultValue}>{holeDiameter.toFixed(2)}<span className={styles.resultUnit}>mm</span></div>
            </div>
            {fitType === 'press' && (
              <div className={styles.result}>
                <div className={styles.resultLabel}>Shaft / Pin Diameter</div>
                <div className={styles.resultValue}>{shaftDiameter.toFixed(2)}<span className={styles.resultUnit}>mm</span></div>
              </div>
            )}
            <div className={styles.result}>
              <div className={styles.resultLabel}>Clearance</div>
              <div className={styles.resultValue}>{clearance.toFixed(2)}<span className={styles.resultUnit}>mm</span></div>
            </div>
            <div className={styles.result}>
              <div className={styles.resultLabel}>Offset Applied</div>
              <div className={styles.resultValue}>{holeOffset > 0 ? '+' : ''}{holeOffset}<span className={styles.resultUnit}>mm</span></div>
            </div>
          </div>
        )}
        <div className={styles.hint}>
          Note: FDM printers typically over-extrude 0.1–0.3 mm. Tune offsets to match your printer.
        </div>
      </div>
    </ConverterShell>
  );
}
