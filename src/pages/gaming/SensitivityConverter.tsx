import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './gaming.module.css';

const GAMES = [
  { name: 'CS2 / CSGO', multiplier: 1 },
  { name: 'Valorant', multiplier: 3.18 },
  { name: 'Apex Legends', multiplier: 1 },
  { name: 'Fortnite', multiplier: 5.62 },
  { name: 'Overwatch 2', multiplier: 10.6 },
  { name: 'Rainbow Six Siege', multiplier: 12.86 },
];

export default function SensitivityConverter() {
  const [sens, setSens] = useState('');
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(1);

  const s = parseFloat(sens);
  const converted = !isNaN(s) && GAMES[from] && GAMES[to]
    ? (s * GAMES[from].multiplier / GAMES[to].multiplier).toFixed(4)
    : null;

  return (
    <ConverterShell title="Game Sensitivity Converter" description="Convert your mouse sensitivity between popular FPS games." category="gaming">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="sc-from">From game</label>
            <select id="sc-from" value={from} onChange={e => setFrom(Number(e.target.value))} style={{ width: '100%' }}>
              {GAMES.map((g, i) => <option key={i} value={i}>{g.name}</option>)}
            </select>
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label htmlFor="sc-to">To game</label>
            <select id="sc-to" value={to} onChange={e => setTo(Number(e.target.value))} style={{ width: '100%' }}>
              {GAMES.map((g, i) => <option key={i} value={i}>{g.name}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="sc-sens">Sensitivity in {GAMES[from]?.name}</label>
          <input id="sc-sens" type="number" min="0.001" step="0.001" placeholder="1.0" value={sens} onChange={e => setSens(e.target.value)} />
        </div>
        {converted && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>{converted}</div><div className={styles.statLabel}>{GAMES[to]?.name} sensitivity</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
