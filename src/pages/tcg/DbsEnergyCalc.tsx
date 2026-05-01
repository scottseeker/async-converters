import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './tcg.module.css';

// DBS energy: each turn you charge 1 energy (max ~10), cards cost 1-5 energy
// Energy can be single or double color — double costs 2 of same color
// Awaken leaders typically need 4 energy to flip

interface EnergyCard {
  id: number;
  name: string;
  cost: number;
  color: string;
}

const COLORS = ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Purple'];
let nextId = 1;

export default function DbsEnergyCalc() {
  const [turn, setTurn] = useState(1);
  const [totalEnergy, setTotalEnergy] = useState(1);
  const [cards, setCards] = useState<EnergyCard[]>([]);
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState(2);
  const [newColor, setNewColor] = useState('Red');
  const [awaken, setAwaken] = useState(false);

  const spent = cards.reduce((a, c) => a + c.cost, 0);
  const remaining = totalEnergy - spent - (awaken ? 4 : 0);
  const awakenCost = 4;

  function addCard() {
    if (!newName.trim()) return;
    setCards(c => [...c, { id: nextId++, name: newName.trim(), cost: newCost, color: newColor }]);
    setNewName('');
    setNewCost(2);
  }

  function removeCard(id: number) { setCards(c => c.filter(x => x.id !== id)); }

  function syncEnergy(t: number) {
    setTurn(t);
    setTotalEnergy(t); // simplified: 1 energy charge per turn
  }

  const COLOR_HEX: Record<string, string> = {
    Red: '#e74c3c', Blue: '#3498db', Yellow: '#f1c40f',
    Green: '#2ecc71', Black: '#636e72', Purple: '#9b59b6',
  };

  return (
    <ConverterShell
      title="DBS Energy Cost Planner"
      description="Plan energy costs for Dragon Ball Super Card Game turns and track remaining energy."
      category="tcg"
    >
      <div className={styles.form}>
        <div className={styles.row} style={{ alignItems: 'center', gap: '1.5rem' }}>
          <div className={styles.field} style={{ minWidth: 100 }}>
            <label>Current Turn</label>
            <input type="number" min={1} max={20} value={turn}
              onChange={e => syncEnergy(Math.max(1, Number(e.target.value)))} />
          </div>
          <div className={styles.field} style={{ minWidth: 100 }}>
            <label>Total Energy</label>
            <input type="number" min={0} max={20} value={totalEnergy}
              onChange={e => setTotalEnergy(Math.max(0, Number(e.target.value)))} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', marginTop: '1.2rem' }}>
            <input type="checkbox" checked={awaken} onChange={e => setAwaken(e.target.checked)} />
            Awaken leader (−{awakenCost} energy)
          </label>
        </div>

        {/* Energy pips */}
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {Array.from({ length: totalEnergy }).map((_, i) => {
            const usedByAwaken = awaken && i < awakenCost;
            const used = awaken ? i < awakenCost + spent : i < spent;
            return (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: 4,
                background: used ? (usedByAwaken ? '#9b59b6' : 'var(--accent)') : 'transparent',
                border: `2px solid ${used ? (usedByAwaken ? '#9b59b6' : 'var(--accent)') : 'var(--border)'}`,
                fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: used ? '#fff' : 'var(--text-muted)',
              }}>
                {usedByAwaken ? '★' : used ? '●' : ''}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
          <span>Spent: <strong style={{ color: 'var(--accent)' }}>{spent + (awaken ? awakenCost : 0)}</strong></span>
          <span>Remaining: <strong style={{ color: remaining >= 0 ? '#2ecc71' : '#e74c3c' }}>{remaining}</strong></span>
          {awaken && <span style={{ color: '#9b59b6' }}>★ Awaken: −{awakenCost}</span>}
        </div>

        {/* Add card */}
        <div className={styles.row} style={{ alignItems: 'flex-end' }}>
          <div className={styles.field} style={{ flex: 3 }}>
            <label>Card name</label>
            <input type="text" placeholder="Son Goku, Super Saiyan" value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addCard(); }} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 70 }}>
            <label>Cost</label>
            <input type="number" min={1} max={10} value={newCost} onChange={e => setNewCost(Number(e.target.value))} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 90 }}>
            <label>Color</label>
            <select value={newColor} onChange={e => setNewColor(e.target.value)}>
              {COLORS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={addCard} style={{ flexShrink: 0 }}>Add</button>
        </div>

        {cards.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {cards.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', padding: '0.35rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: COLOR_HEX[c.color] || 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{c.name}</span>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{c.cost} energy</span>
                <button onClick={() => removeCard(c.id)} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
