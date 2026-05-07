import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './dnd.module.css';

const DICE_TYPES = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'] as const;
type DiceType = typeof DICE_TYPES[number];

const DICE_SIDES: Record<DiceType, number> = {
  d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20,
};

const DICE_COLORS: Record<DiceType, { bg: string; text: string; glow: string }> = {
  d4:  { bg: '#c0392b', text: '#fff', glow: '#e74c3c' },
  d6:  { bg: '#f5f5f0', text: '#1a1a2e', glow: '#ccc' },
  d8:  { bg: '#27ae60', text: '#fff', glow: '#2ecc71' },
  d10: { bg: '#d68910', text: '#fff', glow: '#f39c12' },
  d12: { bg: '#7d3c98', text: '#fff', glow: '#9b59b6' },
  d20: { bg: '#b03a6f', text: '#fff', glow: '#e91e63' },
};

// Standard d6 pip positions on a 3×3 grid (1=top-left, 5=center, 9=bottom-right)
const PIP_PATTERNS: Record<number, number[]> = {
  1: [5],
  2: [3, 7],
  3: [3, 5, 7],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
};

function D6Face({ value }: { value: number | null }) {
  const active = value ? (PIP_PATTERNS[value] ?? []) : [];
  return (
    <div className={styles.pipGrid}>
      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={i}
          className={active.includes(i + 1) ? styles.pip : styles.pipEmpty}
        />
      ))}
    </div>
  );
}

interface DieProps {
  diceType: DiceType;
  result: number | null;
  rolling: boolean;
  dim?: boolean;
  chosen?: boolean;
  showIndicator?: boolean;
}

function Die({ diceType, result, rolling, dim = false, chosen = true, showIndicator = false }: DieProps) {
  const { bg, text, glow } = DICE_COLORS[diceType];
  const isD6 = diceType === 'd6';

  const faceStyle: React.CSSProperties = {
    background: bg,
    color: text,
    opacity: dim ? 0.3 : 1,
    boxShadow: chosen && result !== null && !rolling
      ? `0 0 20px ${glow}99, 0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)`
      : '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
  };

  return (
    <div className={styles.dieWrapper}>
      <div
        className={`${styles.dieFace} ${isD6 ? styles.dieFaceD6 : styles.dieFacePoly} ${rolling ? styles.dieRolling : ''}`}
        style={faceStyle}
      >
        {isD6 ? (
          <D6Face value={rolling ? null : result} />
        ) : (
          <>
            <span className={styles.dieTypeLabel}>{diceType}</span>
            <span className={styles.dieNumber}>
              {rolling ? '?' : (result !== null ? result : '–')}
            </span>
          </>
        )}
      </div>
      {showIndicator && result !== null && !rolling && (
        <span className={chosen ? styles.keptLabel : styles.droppedLabel}>
          {chosen ? '✓ kept' : '✗ dropped'}
        </span>
      )}
    </div>
  );
}

export default function DndDice() {
  const [diceType, setDiceType] = useState<DiceType>('d20');
  const [count, setCount] = useState(2);
  const [modifier, setModifier] = useState(0);
  const [advantageMode, setAdvantageMode] = useState<'normal' | 'advantage' | 'disadvantage'>('normal');
  const [rolling, setRolling] = useState(false);
  const [rolls, setRolls] = useState<number[]>([]);
  const [advPair, setAdvPair] = useState<[number, number] | null>(null);

  const sides = DICE_SIDES[diceType];
  const isAdvMode = advantageMode !== 'normal';

  function doRoll() {
    if (rolling) return;
    setRolling(true);
    setRolls([]);
    setAdvPair(null);
    const delay = 900;
    setTimeout(() => {
      if (isAdvMode) {
        const r1 = Math.floor(Math.random() * sides) + 1;
        const r2 = Math.floor(Math.random() * sides) + 1;
        setAdvPair([r1, r2]);
        const chosen = advantageMode === 'advantage' ? Math.max(r1, r2) : Math.min(r1, r2);
        setRolls([chosen]);
      } else {
        setRolls(Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1));
      }
      setRolling(false);
    }, delay);
  }

  const total = rolls.reduce((a, b) => a + b, 0) + modifier;

  function chosenAdvIndex(): number {
    if (!advPair) return 0;
    return advantageMode === 'advantage'
      ? (advPair[0] >= advPair[1] ? 0 : 1)
      : (advPair[0] <= advPair[1] ? 0 : 1);
  }

  const rollLabel = isAdvMode
    ? `Roll 2${diceType} (${advantageMode})`
    : `Roll ${count}${diceType}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`;

  return (
    <ConverterShell
      title="D&D Dice Roller"
      description="Roll multiple polyhedral dice with advantage/disadvantage and modifiers."
      category="dnd"
    >
      <div className={styles.form}>
        {/* Die type picker */}
        <div className={styles.diceRow}>
          <label>Die Type</label>
          <div className={styles.diceTypes}>
            {DICE_TYPES.map(d => (
              <button key={d}
                className={`${styles.diceBtn} ${d === diceType ? styles.diceBtnActive : ''}`}
                onClick={() => { setDiceType(d); setRolls([]); setAdvPair(null); }}
              >{d}</button>
            ))}
          </div>
        </div>

        {/* Count + modifier */}
        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}>
            <label>Dice count {isAdvMode && <span style={{ opacity: 0.6, fontSize: '0.78rem' }}>(locked to 2)</span>}</label>
            <input type="number" min={1} max={10} value={isAdvMode ? 2 : count}
              disabled={isAdvMode}
              onChange={e => setCount(Math.max(1, Math.min(10, Number(e.target.value))))} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}>
            <label>Modifier</label>
            <input type="number" min={-20} max={20} value={modifier}
              onChange={e => setModifier(Number(e.target.value))} />
          </div>
        </div>

        {/* Advantage mode */}
        <div className={styles.diceRow}>
          <label>Mode</label>
          <div className={styles.diceTypes}>
            {(['normal', 'advantage', 'disadvantage'] as const).map(m => (
              <button key={m}
                className={`${styles.diceBtn} ${m === advantageMode ? styles.diceBtnActive : ''}`}
                onClick={() => { setAdvantageMode(m); setRolls([]); setAdvPair(null); }}
              >{m.charAt(0).toUpperCase() + m.slice(1)}</button>
            ))}
          </div>
        </div>

        <button className={styles.rollBtn} onClick={doRoll} disabled={rolling}>
          {rolling ? 'Rolling…' : rollLabel}
        </button>

        {/* Dice display */}
        <div className={styles.diceGrid}>
          {isAdvMode ? (
            [0, 1].map(i => {
              const ci = chosenAdvIndex();
              const r = advPair ? advPair[i] : null;
              return (
                <Die key={i} diceType={diceType} rolling={rolling}
                  result={r}
                  dim={advPair !== null && i !== ci}
                  chosen={advPair === null || i === ci}
                  showIndicator />
              );
            })
          ) : (
            Array.from({ length: isAdvMode ? 2 : count }).map((_, i) => (
              <Die key={i} diceType={diceType} rolling={rolling}
                result={rolls[i] ?? null} />
            ))
          )}
        </div>

        {/* Results summary */}
        {rolls.length > 0 && !rolling && (
          <div className={styles.diceResults}>
            <div>
              <div className={styles.totalNum}>{total}</div>
              <div className={styles.totalLabel}>Total</div>
            </div>
            <div>
              {rolls.length > 1 && (
                <div className={styles.rollBreakdown}>
                  [{rolls.join(' + ')}]{modifier !== 0 ? ` + ${modifier}` : ''} = {total}
                </div>
              )}
              {rolls.length === 1 && modifier !== 0 && (
                <div className={styles.rollBreakdown}>{rolls[0]} + {modifier} = {total}</div>
              )}
              {advPair && (
                <div className={styles.rollBreakdown}>
                  {advantageMode}: rolled {advPair[0]} and {advPair[1]} → kept {rolls[0]}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
