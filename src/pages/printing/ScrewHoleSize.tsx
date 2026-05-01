import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './printing.module.css';

interface ScrewData {
  od: number;
  close: number;
  normal: number;
  loose: number;
  tap: number;
}

const SCREWS: Record<string, ScrewData> = {
  'M2':   { od: 2.0,  close: 2.2,  normal: 2.4,  loose: 2.6,  tap: 1.6  },
  'M2.5': { od: 2.5,  close: 2.7,  normal: 2.9,  loose: 3.1,  tap: 2.05 },
  'M3':   { od: 3.0,  close: 3.2,  normal: 3.4,  loose: 3.6,  tap: 2.5  },
  'M4':   { od: 4.0,  close: 4.3,  normal: 4.5,  loose: 4.8,  tap: 3.3  },
  'M5':   { od: 5.0,  close: 5.3,  normal: 5.5,  loose: 5.8,  tap: 4.2  },
  'M6':   { od: 6.0,  close: 6.4,  normal: 6.6,  loose: 7.0,  tap: 5.0  },
  'M8':   { od: 8.0,  close: 8.4,  normal: 9.0,  loose: 10.0, tap: 6.75 },
  'M10':  { od: 10.0, close: 10.5, normal: 11.0, loose: 12.0, tap: 8.5  },
  'M12':  { od: 12.0, close: 12.5, normal: 13.0, loose: 14.0, tap: 10.2 },
};

export default function ScrewHoleSize() {
  return (
    <ConverterShell
      title="Screw Hole Size Reference"
      description="ISO metric screw clearance holes and tap drill sizes for 3D printed parts."
      category="printing"
    >
      <div className={styles.form}>
        <div className={styles.hint}>
          Clearance hole fits around the screw body. Tap drill is for cutting threads.
          For FDM prints, use +0.1–0.2 mm over the listed value for best fit.
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.screwTable}>
            <thead>
              <tr>
                <th>Size</th>
                <th>Screw OD (mm)</th>
                <th>Close fit (mm)</th>
                <th>Normal fit (mm)</th>
                <th>Loose fit (mm)</th>
                <th>Tap drill (mm)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(SCREWS).map(([size, d]) => (
                <tr key={size}>
                  <td><strong>{size}</strong></td>
                  <td>{d.od.toFixed(1)}</td>
                  <td>{d.close.toFixed(1)}</td>
                  <td>{d.normal.toFixed(1)}</td>
                  <td>{d.loose.toFixed(1)}</td>
                  <td>{d.tap.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.hint}>
          Source: ISO 286 / ISO 965 standard tolerance tables. Actual FDM results vary by printer calibration and layer height.
        </div>
      </div>
    </ConverterShell>
  );
}
