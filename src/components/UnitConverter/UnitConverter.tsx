import { useState } from 'react';
import type { UnitConverterConfig } from '../../types';
import styles from './UnitConverter.module.css';

interface Props {
  config: UnitConverterConfig;
}

export default function UnitConverter({ config }: Props) {
  const { units } = config;
  const [fromId, setFromId] = useState(units[0].id);
  const [toId, setToId] = useState(units[1].id);
  const [inputValue, setInputValue] = useState('');

  const fromUnit = units.find(u => u.id === fromId)!;
  const toUnit = units.find(u => u.id === toId)!;

  const numInput = parseFloat(inputValue);
  let result = '';
  if (inputValue !== '' && !isNaN(numInput)) {
    const base = fromUnit.toBase(numInput);
    const converted = toUnit.fromBase(base);
    result = Number.isFinite(converted)
      ? parseFloat(converted.toPrecision(10)).toString()
      : 'Error';
  }

  function swap() {
    setFromId(toId);
    setToId(fromId);
    setInputValue(result !== '' ? result : inputValue);
  }

  return (
    <div className={styles.converter}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="from-unit">From</label>
          <select
            id="from-unit"
            value={fromId}
            onChange={e => setFromId(e.target.value)}
          >
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </div>

        <button className={styles.swapBtn} onClick={swap} title="Swap units" aria-label="Swap units">
          ⇄
        </button>

        <div className={styles.field}>
          <label htmlFor="to-unit">To</label>
          <select
            id="to-unit"
            value={toId}
            onChange={e => setToId(e.target.value)}
          >
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="from-value">Value ({fromUnit.label})</label>
          <input
            id="from-value"
            type="number"
            placeholder="Enter value…"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
        </div>

        <div style={{ width: 38, flexShrink: 0 }} />

        <div className={styles.field}>
          <label>Result ({toUnit.label})</label>
          <div className={styles.output} aria-live="polite">
            {result || <span style={{ color: 'var(--text-muted)' }}>—</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
