import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './dnd.module.css';

interface Combatant {
  id: number;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  conditions: string;
}

let nextId = 1;

export default function InitiativeTracker() {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [newName, setNewName] = useState('');
  const [newInit, setNewInit] = useState('');
  const [newHp, setNewHp] = useState('');
  const [turn, setTurn] = useState(0);
  const [round, setRound] = useState(1);

  const sorted = [...combatants].sort((a, b) => b.initiative - a.initiative);

  function add() {
    if (!newName.trim()) return;
    const init = parseInt(newInit) || 0;
    const hp = parseInt(newHp) || 10;
    setCombatants(c => [...c, { id: nextId++, name: newName.trim(), initiative: init, hp, maxHp: hp, conditions: '' }]);
    setNewName('');
    setNewInit('');
    setNewHp('');
  }

  function remove(id: number) {
    setCombatants(c => c.filter(x => x.id !== id));
    setTurn(0);
  }

  function updateHp(id: number, delta: number) {
    setCombatants(c => c.map(x => x.id === id ? { ...x, hp: Math.max(0, x.hp + delta) } : x));
  }

  function setHp(id: number, val: number) {
    setCombatants(c => c.map(x => x.id === id ? { ...x, hp: Math.max(0, val) } : x));
  }

  function nextTurn() {
    if (sorted.length === 0) return;
    const next = (turn + 1) % sorted.length;
    if (next === 0) setRound(r => r + 1);
    setTurn(next);
  }

  function reset() {
    setTurn(0);
    setRound(1);
  }

  return (
    <ConverterShell title="Initiative Tracker" description="Track initiative order, HP, and conditions for D&D combat encounters." category="dnd">
      <div className={styles.form}>
        <div className={styles.row} style={{ alignItems: 'flex-end' }}>
          <div className={styles.field} style={{ flex: 3 }}>
            <label>Name</label>
            <input type="text" placeholder="Goblin / Aragorn…" value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') add(); }} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 70 }}>
            <label>Initiative</label>
            <input type="number" placeholder="14" value={newInit} onChange={e => setNewInit(e.target.value)} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 70 }}>
            <label>HP</label>
            <input type="number" placeholder="20" value={newHp} onChange={e => setNewHp(e.target.value)} />
          </div>
          <button onClick={add} style={{ flexShrink: 0 }}>Add</button>
        </div>

        {sorted.length > 0 && (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.8rem' }}>Round {round}</strong>
              <button onClick={nextTurn}>Next Turn →</button>
              <button onClick={reset} style={{ fontSize: '0.75rem' }}>Reset Rounds</button>
              <button onClick={() => setCombatants([])} style={{ fontSize: '0.75rem', color: '#e55' }}>Clear All</button>
            </div>
            <div className={styles.initiativeList}>
              {sorted.map((c, i) => (
                <div key={c.id} className={`${styles.initiativeRow} ${i === turn ? styles.initiativeActive : ''}`}>
                  <div className={styles.initiativeRank}>{i + 1}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', minWidth: 28 }}>
                    {c.initiative}
                  </div>
                  <div className={styles.initiativeName}>{c.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <button className={styles.removeBtn} onClick={() => updateHp(c.id, -1)}>−</button>
                    <input
                      type="number" value={c.hp}
                      onChange={e => setHp(c.id, Number(e.target.value))}
                      style={{ width: 46, textAlign: 'center', padding: '0.15rem 0.25rem', fontSize: '0.8rem' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ {c.maxHp}</span>
                    <button className={styles.removeBtn} onClick={() => updateHp(c.id, 1)}>+</button>
                  </div>
                  <span className={`${styles.hpBadge} ${c.hp <= Math.ceil(c.maxHp * 0.25) ? styles.hpBadgeLow : ''}`}>
                    {c.hp === 0 ? '💀 Down' : c.hp <= Math.ceil(c.maxHp * 0.25) ? '⚠ Bloodied' : '✓'}
                  </span>
                  <button className={styles.removeBtn} onClick={() => remove(c.id)}>✕</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
