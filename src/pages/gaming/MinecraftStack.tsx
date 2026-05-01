import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './gaming.module.css';

const STACK_SIZE = 64;

export default function MinecraftStack() {
  const [items, setItems] = useState('');

  const n = parseInt(items);
  if (!isNaN(n) && n > 0) {
    // valid input
  }

  const n2 = parseInt(items) || 0;
  const stacks = Math.floor(n2 / STACK_SIZE);
  const remainder = n2 % STACK_SIZE;

  return (
    <ConverterShell title="Minecraft Stack Calculator" description="Calculate how many stacks (64) and remaining items for a given count." category="gaming">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="ms-items">Number of items</label>
          <input id="ms-items" type="number" min="0" step="1" placeholder="1000" value={items} onChange={e => setItems(e.target.value)} />
        </div>
        {n2 > 0 && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}><div className={styles.statNum}>{stacks}</div><div className={styles.statLabel}>Full stacks (×64)</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{remainder}</div><div className={styles.statLabel}>Remaining</div></div>
              <div className={styles.stat}><div className={styles.statNum}>{n2}</div><div className={styles.statLabel}>Total items</div></div>
            </div>
            <div className={styles.field}>
              <label>Compact notation</label>
              <input readOnly value={remainder > 0 ? `${stacks} stacks + ${remainder}` : `${stacks} stacks`} />
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
