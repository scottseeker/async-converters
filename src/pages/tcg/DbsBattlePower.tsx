import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './tcg.module.css';

// Dragon Ball Super Card Game: attacker must beat defender's battle power to deal damage
// Combo cards add +5000 per card played
// Critical keyword = 2 damage, Blocker can intercept attacks

export default function DbsBattlePower() {
  const [attackBP, setAttackBP] = useState<number | ''>(15000);
  const [defBP, setDefBP] = useState<number | ''>(10000);
  const [attackCombo, setAttackCombo] = useState(0);
  const [defCombo, setDefCombo] = useState(0);
  const [critical, setCritical] = useState(false);
  const [blocker, setBlocker] = useState(false);
  const [blockerBP, setBlockerBP] = useState<number | ''>(10000);

  const atk = Number(attackBP) || 0;
  const def = Number(defBP) || 0;
  const blk = Number(blockerBP) || 0;

  const finalAtk = atk + attackCombo * 5000;
  const finalDef = blocker ? blk + defCombo * 5000 : def + defCombo * 5000;
  const hits = finalAtk > finalDef;
  const damage = critical ? 2 : 1;
  const defNeedsToBlock = finalAtk - finalDef;

  return (
    <ConverterShell
      title="DBS Battle Power Calculator"
      description="Compare attacker and defender battle power with combo card bonuses in Dragon Ball Super Card Game."
      category="tcg"
    >
      <div className={styles.form}>
        <div className={styles.row}>
          {/* Attacker */}
          <div style={{ flex: 1, minWidth: 200, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#e74c3c', letterSpacing: '0.07em' }}>⚔ Attacker</div>
            <div className={styles.field}>
              <label>Battle Power</label>
              <input type="number" min={0} step={1000} value={attackBP}
                onChange={e => setAttackBP(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <div className={styles.field}>
              <label>Combo cards played: {attackCombo}</label>
              <input type="range" min={0} max={10} value={attackCombo} onChange={e => setAttackCombo(Number(e.target.value))} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+{(attackCombo * 5000).toLocaleString()} BP</span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={critical} onChange={e => setCritical(e.target.checked)} />
              Critical (deals 2 damage)
            </label>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#e74c3c' }}>
              Final: {finalAtk.toLocaleString()}
            </div>
          </div>

          {/* Defender */}
          <div style={{ flex: 1, minWidth: 200, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#3498db', letterSpacing: '0.07em' }}>🛡 Defender</div>
            <div className={styles.field}>
              <label>Leader / Battle Power</label>
              <input type="number" min={0} step={1000} value={defBP}
                onChange={e => setDefBP(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={blocker} onChange={e => setBlocker(e.target.checked)} />
              Use Blocker
            </label>
            {blocker && (
              <div className={styles.field}>
                <label>Blocker BP</label>
                <input type="number" min={0} step={1000} value={blockerBP}
                  onChange={e => setBlockerBP(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
            )}
            <div className={styles.field}>
              <label>Combo cards: {defCombo}</label>
              <input type="range" min={0} max={10} value={defCombo} onChange={e => setDefCombo(Number(e.target.value))} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+{(defCombo * 5000).toLocaleString()} BP</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#3498db' }}>
              Final: {finalDef.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Result */}
        <div style={{
          padding: '1rem', borderRadius: 'var(--radius)',
          background: hits ? 'color-mix(in srgb, #e74c3c 12%, transparent)' : 'color-mix(in srgb, #2ecc71 12%, transparent)',
          border: `2px solid ${hits ? '#e74c3c' : '#2ecc71'}`,
          textAlign: 'center',
        }}>
          {hits ? (
            <>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#e74c3c' }}>✓ Attack hits! {damage} damage</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Attacker exceeds defender by {(finalAtk - finalDef).toLocaleString()} BP
                {critical && ' · Critical — 2 damage dealt'}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2ecc71' }}>✗ Attack blocked / fails</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Defender needs {defNeedsToBlock > 0 ? '0' : Math.abs(defNeedsToBlock).toLocaleString()} more BP to fail
                · Attacker needs {Math.max(0, finalDef - finalAtk + 1).toLocaleString()} more BP to hit
              </div>
            </>
          )}
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          DBS combo rule: each combo card played adds +5,000 BP. Critical doubles damage dealt.
        </div>
      </div>
    </ConverterShell>
  );
}
