import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './dnd.module.css';

const DICE_TYPES = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'] as const;
type DiceType = typeof DICE_TYPES[number];

const DICE_COLORS: Record<DiceType, string> = {
  d4: '#e74c3c', d6: '#3498db', d8: '#2ecc71',
  d10: '#f39c12', d12: '#9b59b6', d20: '#e91e63',
};

const DICE_SIDES: Record<DiceType, number> = {
  d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20,
};

// Build a canvas texture with a number on a coloured background
function makeNumberTexture(num: number, bgColor: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Background with slight vignette
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Rounded rect inset
  const pad = 20;
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath();
  ctx.roundRect(pad, pad, size - pad * 2, size - pad * 2, 18);
  ctx.fill();

  // Number
  const fontSize = num >= 10 ? 110 : 130;
  ctx.font = `900 ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 8;
  ctx.fillText(String(num), size / 2, size / 2 + 6);

  // Underline 6 and 9 to disambiguate
  if (num === 6 || num === 9) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(size / 2 - 30, size / 2 + 62);
    ctx.lineTo(size / 2 + 30, size / 2 + 62);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

// Build face textures — only needed for d6 (BoxGeometry has 6 assignable face groups)
function useFaceTextures(diceType: DiceType): THREE.CanvasTexture[] {
  return useMemo(() => {
    if (diceType !== 'd6') return [];
    const color = DICE_COLORS[diceType];
    return Array.from({ length: 6 }, (_, i) => makeNumberTexture(i + 1, color));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diceType]);
}

interface SingleDieProps {
  diceType: DiceType;
  rolling: boolean;
  result: number | null;
  isAdvDisadvSecond?: boolean;
  chosen?: boolean;
}

function SingleDie({ diceType, rolling, result, isAdvDisadvSecond = false, chosen = true }: SingleDieProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const velRef = useRef({ x: 0, y: 0, z: 0 });
  const targetRef = useRef<THREE.Euler | null>(null);
  const textures = useFaceTextures(diceType);

  // When rolling starts: spin fast
  useEffect(() => {
    if (rolling) {
      targetRef.current = null;
      velRef.current = {
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 30,
        z: (Math.random() - 0.5) * 30,
      };
    } else if (result !== null && meshRef.current) {
      // Snap to a rotation that shows the result face upward (approximation for most shapes)
      // For d6, we can be precise; others just settle to a random orientation
      if (diceType === 'd6') {
        // face index = result - 1; map to rotation
        // face order: +x, -x, +y, -y, +z, -z
        const faceRots: [number, number, number][] = [
          [0, -Math.PI / 2, 0],     // 1: +x
          [0,  Math.PI / 2, 0],     // 2: -x
          [-Math.PI / 2, 0, 0],     // 3: +y (top)
          [ Math.PI / 2, 0, 0],     // 4: -y
          [0, 0, 0],                // 5: +z
          [0, Math.PI, 0],          // 6: -z
        ];
        const [rx, ry, rz] = faceRots[result - 1] ?? [0, 0, 0];
        targetRef.current = new THREE.Euler(rx, ry, rz);
      }
      velRef.current = { x: 0, y: 0, z: 0 };
    }
  }, [rolling, result, diceType]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (rolling) {
      meshRef.current.rotation.x += velRef.current.x * delta;
      meshRef.current.rotation.y += velRef.current.y * delta;
      meshRef.current.rotation.z += velRef.current.z * delta;
    } else {
      // Decelerate or lerp to target
      if (targetRef.current) {
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRef.current.x, 0.12);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRef.current.y, 0.12);
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRef.current.z, 0.12);
      } else {
        velRef.current.x *= 0.82;
        velRef.current.y *= 0.82;
        velRef.current.z *= 0.82;
        meshRef.current.rotation.x += velRef.current.x * delta;
        meshRef.current.rotation.y += velRef.current.y * delta;
        meshRef.current.rotation.z += velRef.current.z * delta;
      }
    }
  });

  const color = DICE_COLORS[diceType];
  const opacity = isAdvDisadvSecond && !chosen ? 0.4 : 1.0;

  // For d6: assign one texture per face (BoxGeometry has 6 materials)
  if (diceType === 'd6') {
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        {textures.slice(0, 6).map((tex, i) => (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            map={tex}
            roughness={0.2}
            metalness={0.1}
            transparent
            opacity={opacity}
          />
        ))}
      </mesh>
    );
  }

  // Non-d6: solid colour — UV texture wrapping on polyhedra is unreliable;
  // the result number is shown as a large HTML overlay instead.
  function Geometry() {
    switch (diceType) {
      case 'd4':  return <tetrahedronGeometry args={[1.4, 0]} />;
      case 'd8':  return <octahedronGeometry args={[1.4, 0]} />;
      case 'd10': return <cylinderGeometry args={[0.15, 1.15, 2.1, 10, 1]} />;
      case 'd12': return <dodecahedronGeometry args={[1.3, 0]} />;
      case 'd20': return <icosahedronGeometry args={[1.4, 0]} />;
      default:    return <boxGeometry args={[1.6, 1.6, 1.6]} />;
    }
  }

  return (
    <mesh ref={meshRef}>
      <Geometry />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} transparent opacity={opacity} />
    </mesh>
  );
}

interface DieTrayProps {
  diceType: DiceType;
  rolling: boolean;
  result: number | null;
  large?: boolean;
  isAdvDisadvSecond?: boolean;
  chosen?: boolean;
}

function DieTray({ diceType, rolling, result, large = false, isAdvDisadvSecond = false, chosen = true }: DieTrayProps) {
  const cls = large ? `${styles.dieTray} ${styles.dieTrayLg}` : styles.dieTray;
  return (
    <div className={cls} style={{ position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} style={{ borderRadius: 'inherit' }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[4, 4, 6]} intensity={1.4} />
        <pointLight position={[-4, -3, -3]} intensity={0.5} />
        <SingleDie diceType={diceType} rolling={rolling} result={result}
          isAdvDisadvSecond={isAdvDisadvSecond} chosen={chosen} />
      </Canvas>
      {/* Result overlay — large and centred so it's readable on any die shape */}
      {result !== null && !rolling && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center', lineHeight: 1,
          fontSize: large ? '3rem' : '2.2rem',
          fontWeight: 900, color: '#fff',
          textShadow: '0 0 14px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.9)',
          pointerEvents: 'none',
          opacity: isAdvDisadvSecond && !chosen ? 0.45 : 1,
        }}>
          {result}
          {isAdvDisadvSecond && (
            <div style={{ fontSize: '0.4em', marginTop: 4, opacity: 0.9 }}>
              {chosen ? '✓' : '✗'}
            </div>
          )}
        </div>
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
  const [advPair, setAdvPair] = useState<[number, number] | null>(null); // for adv/disadv single-die mode

  const sides = DICE_SIDES[diceType];
  const isAdvMode = advantageMode !== 'normal';
  // In adv mode, always 2 dice; otherwise use count
  const displayCount = isAdvMode ? 2 : count;

  function doRoll() {
    if (rolling) return;
    setRolling(true);
    setRolls([]);
    setAdvPair(null);
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
    }, 1500);
  }

  const total = rolls.reduce((a, b) => a + b, 0) + modifier;

  // Which die indices are "chosen" for adv display
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
      title="D&D Dice Roller (3D)"
      description="Roll multiple polyhedral dice with 3D spin animation, advantage/disadvantage, and modifiers."
      category="dnd"
    >
      <div className={styles.form}>
        {/* Controls */}
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

        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}>
            <label>Number of dice {isAdvMode && '(locked to 2 in adv. mode)'}</label>
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

        {/* Dice trays grid */}
        <div className={styles.diceGrid}>
          {isAdvMode ? (
            // Adv mode: always show 2 dice, one large each
            [0, 1].map(i => {
              const ci = chosenAdvIndex();
              const r = advPair ? advPair[i] : null;
              return (
                <DieTray key={i} diceType={diceType} rolling={rolling}
                  result={r} large
                  isAdvDisadvSecond={i !== ci && advPair !== null}
                  chosen={i === ci || advPair === null} />
              );
            })
          ) : (
            Array.from({ length: displayCount }).map((_, i) => (
              <DieTray key={i} diceType={diceType} rolling={rolling}
                result={rolls[i] ?? null}
                large={displayCount === 1} />
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
