import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './random.module.css';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RandomGroup() {
  const [names, setNames] = useState('');
  const [groupCount, setGroupCount] = useState(2);
  const [groups, setGroups] = useState<string[][]>([]);

  function split() {
    const people = names.split('\n').map(l => l.trim()).filter(Boolean);
    if (!people.length) return;
    const shuffled = shuffle(people);
    const result: string[][] = Array.from({ length: groupCount }, () => []);
    shuffled.forEach((p, i) => result[i % groupCount].push(p));
    setGroups(result);
  }

  return (
    <ConverterShell title="Random Group Maker" description="Split a list of names into random groups." category="random">
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Names (one per line)</label>
          <textarea style={{ minHeight: 130 }} placeholder={'Alice\nBob\nCharlie\nDave\nEve'} value={names} onChange={e => setNames(e.target.value)} />
        </div>
        <div className={styles.field} style={{ maxWidth: 200 }}>
          <label>Number of groups: {groupCount}</label>
          <input type="range" min={2} max={20} value={groupCount} onChange={e => setGroupCount(Number(e.target.value))} />
        </div>
        <div className={styles.actions}>
          <button onClick={split}>Split into Groups</button>
          <button onClick={() => setGroups([])}>Clear</button>
        </div>
        {groups.length > 0 && (
          <div className={styles.grid}>
            {groups.map((g, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardLabel}>Group {i + 1}</div>
                {g.map((p, j) => <div key={j} style={{ fontSize: '0.9rem', padding: '0.15rem 0' }}>{p}</div>)}
              </div>
            ))}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
