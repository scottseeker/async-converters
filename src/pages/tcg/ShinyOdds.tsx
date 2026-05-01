import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './tcg.module.css';

interface ShinyMethod {
  label: string;
  baseOdds: number;
  charmOdds: number;
  note?: string;
}

const METHODS: ShinyMethod[] = [
  { label: 'Standard (Gen 6+)',          baseOdds: 4096,  charmOdds: 1365,  note: 'Default Gen 6–9 encounter' },
  { label: 'Standard (Gen 1–5)',         baseOdds: 8192,  charmOdds: 8192,  note: 'Shiny Charm not available' },
  { label: 'Masuda Method (Gen 6+)',     baseOdds: 512,   charmOdds: 341,   note: 'Two different language games' },
  { label: 'Masuda Method (Gen 4–5)',    baseOdds: 1638,  charmOdds: 1638,  note: 'Gen 4–5 rate' },
  { label: 'Poké Radar Chaining (Gen 4)',baseOdds: 200,   charmOdds: 200,   note: 'Chain of 40' },
  { label: 'SOS Chaining (Gen 7)',       baseOdds: 315,   charmOdds: 100,   note: 'Chain 31+ calls' },
  { label: 'Outbreak (Scarlet/Violet)',  baseOdds: 512,   charmOdds: 341,   note: 'Mass outbreak, 60 in outbreak' },
  { label: 'Sparkling Power Lv 3',       baseOdds: 512,   charmOdds: 341,   note: 'Sandwich + Charm ≈ 1/512 base' },
];

function poissonAtLeastOne(p: number, n: number) {
  return (1 - Math.pow(1 - p, n)) * 100;
}

export default function ShinyOdds() {
  const [methodIdx, setMethodIdx] = useState(0);
  const [shinyCharm, setShinyCharm] = useState(false);
  const [encounters, setEncounters] = useState(100);

  const method = METHODS[methodIdx];
  const odds = shinyCharm ? method.charmOdds : method.baseOdds;
  const probability = 1 / odds;
  const percent = poissonAtLeastOne(probability, encounters);
  const expected = Math.ceil(odds); // expected encounters to find one

  return (
    <ConverterShell title="Shiny Odds Calculator" description="Calculate shiny encounter probability with Shiny Charm, Masuda Method, and other game modifiers." category="tcg">
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Hunting Method</label>
          <select value={methodIdx} onChange={e => setMethodIdx(Number(e.target.value))}>
            {METHODS.map((m, i) => <option key={i} value={i}>{m.label}</option>)}
          </select>
          {method.note && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{method.note}</span>}
        </div>

        <label className={styles.checkRow}>
          <input type="checkbox" checked={shinyCharm} onChange={e => setShinyCharm(e.target.checked)} />
          Shiny Charm active
        </label>

        <div className={styles.field}>
          <label>Encounters so far: {encounters}</label>
          <input type="range" min={1} max={10000} step={1} value={encounters} onChange={e => setEncounters(Number(e.target.value))} />
        </div>

        <div className={styles.oddsDisplay}>
          <div className={styles.oddsMain}>1 / {odds.toLocaleString()}</div>
          <div className={styles.oddsLabel}>Shiny odds per encounter</div>
          <div className={styles.oddsRow}>
            <div>
              <strong>{percent.toFixed(2)}%</strong>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>chance after {encounters.toLocaleString()} encounters</div>
            </div>
            <div>
              <strong>~{expected.toLocaleString()}</strong>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>expected encounters for 1 shiny</div>
            </div>
            <div>
              <strong>{(odds * Math.log(2)).toFixed(0).toLocaleString()}</strong>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>encounters for 50% chance</div>
            </div>
          </div>
        </div>
      </div>
    </ConverterShell>
  );
}
