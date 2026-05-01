import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './printing.module.css';

export default function ScaleResize() {
  const [x, setX] = useState<number | ''>(100);
  const [y, setY] = useState<number | ''>(100);
  const [z, setZ] = useState<number | ''>(100);
  const [scale, setScale] = useState<number | ''>(75);
  const [mode, setMode] = useState<'scale' | 'target'>('scale');
  const [targetDim, setTargetDim] = useState<'x' | 'y' | 'z'>('x');
  const [targetVal, setTargetVal] = useState<number | ''>(80);

  const ox = Number(x) || 0;
  const oy = Number(y) || 0;
  const oz = Number(z) || 0;
  const sc = Number(scale) || 100;

  let computedScale = sc;
  if (mode === 'target') {
    const original = targetDim === 'x' ? ox : targetDim === 'y' ? oy : oz;
    computedScale = original > 0 ? (Number(targetVal) / original) * 100 : 100;
  }

  const factor = computedScale / 100;
  const nx = ox * factor;
  const ny = oy * factor;
  const nz = oz * factor;

  const volRatio = factor ** 3;

  return (
    <ConverterShell
      title="Scale & Resize Calculator"
      description="Scale 3D model dimensions up or down and preview new measurements."
      category="printing"
    >
      <div className={styles.form}>
        <div className={styles.row}>
          {(['x', 'y', 'z'] as const).map(dim => (
            <div key={dim} className={styles.field} style={{ flex: 1, minWidth: 90 }}>
              <label>Original {dim.toUpperCase()} (mm)</label>
              <input type="number" min={0} step={0.1}
                value={dim === 'x' ? x : dim === 'y' ? y : z}
                onChange={e => {
                  const v = e.target.value === '' ? '' : Number(e.target.value);
                  if (dim === 'x') setX(v); else if (dim === 'y') setY(v); else setZ(v);
                }}
              />
            </div>
          ))}
        </div>

        <div className={styles.row}>
          <button onClick={() => setMode('scale')} style={{ fontWeight: mode === 'scale' ? 700 : undefined, borderColor: mode === 'scale' ? 'var(--accent)' : undefined }}>
            Scale by %
          </button>
          <button onClick={() => setMode('target')} style={{ fontWeight: mode === 'target' ? 700 : undefined, borderColor: mode === 'target' ? 'var(--accent)' : undefined }}>
            Fit to dimension
          </button>
        </div>

        {mode === 'scale' ? (
          <div className={styles.field} style={{ maxWidth: 200 }}>
            <label>Scale (%)</label>
            <input type="number" min={1} max={10000} step={1} value={scale}
              onChange={e => setScale(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
        ) : (
          <div className={styles.row}>
            <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
              <label>Target axis</label>
              <select value={targetDim} onChange={e => setTargetDim(e.target.value as 'x'|'y'|'z')}>
                <option value="x">X</option>
                <option value="y">Y</option>
                <option value="z">Z</option>
              </select>
            </div>
            <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
              <label>Target size (mm)</label>
              <input type="number" min={0} step={0.1} value={targetVal}
                onChange={e => setTargetVal(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
          </div>
        )}

        {(ox > 0 || oy > 0 || oz > 0) && (
          <div className={styles.grid}>
            <div className={`${styles.result} ${styles.resultHighlight}`}>
              <div className={styles.resultLabel}>Scale Factor</div>
              <div className={styles.resultValue}>{computedScale.toFixed(2)}<span className={styles.resultUnit}>%</span></div>
            </div>
            <div className={styles.result}>
              <div className={styles.resultLabel}>New X</div>
              <div className={styles.resultValue}>{nx.toFixed(2)}<span className={styles.resultUnit}>mm</span></div>
            </div>
            <div className={styles.result}>
              <div className={styles.resultLabel}>New Y</div>
              <div className={styles.resultValue}>{ny.toFixed(2)}<span className={styles.resultUnit}>mm</span></div>
            </div>
            <div className={styles.result}>
              <div className={styles.resultLabel}>New Z</div>
              <div className={styles.resultValue}>{nz.toFixed(2)}<span className={styles.resultUnit}>mm</span></div>
            </div>
            <div className={styles.result}>
              <div className={styles.resultLabel}>Volume ratio</div>
              <div className={styles.resultValue}>{volRatio.toFixed(3)}<span className={styles.resultUnit}>×</span></div>
            </div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
