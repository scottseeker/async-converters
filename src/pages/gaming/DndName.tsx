import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './gaming.module.css';

const PREFIXES = { human: ['Ad','Al','Bal','Cor','Dan','Ed','Gar','Hal','Ian','Jak'],
  elf: ['Aer','Ara','Cel','Ely','Gal','Ith','Lor','Nae','Riv','Syl'],
  dwarf: ['Bog','Bru','Dur','Gim','Gor','Kaz','Mor','Rok','Thor','Ul'],
  orc: ['Azu','Bru','Drak','Grak','Korg','Mol','Naz','Rak','Skul','Thrak'],
  halfling: ['Bil','Fil','Fro','Mer','Pip','Rob','Sam','Tom','Will','Wise'],
};
const SUFFIXES = { human: ['and','ard','as','en','or','us','win','wyn','ian'],
  elf: ['ath','diel','ion','iras','ith','las','lis','riel','rion'],
  dwarf: ['ain','ak','din','dur','gin','in','ok','on','ur'],
  orc: ['ag','ak','ash','gat','kag','nar','ok','rag','zug'],
  halfling: ['bo','ey','fie','foot','kins','rose','shire','son','wise'],
};

type Race = keyof typeof PREFIXES;

function randItem<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function DndName() {
  const [race, setRace] = useState<Race>('human');
  const [count, setCount] = useState(8);
  const [names, setNames] = useState<string[]>([]);

  function generate() {
    setNames(Array.from({ length: count }, () => {
      const pre = randItem(PREFIXES[race]);
      const suf = randItem(SUFFIXES[race]);
      return pre + suf;
    }));
  }

  return (
    <ConverterShell title="D&D Character Name Generator" description="Generate fantasy RPG character names for different races." category="gaming">
      <div className={styles.form}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label>Race</label>
            <select value={race} onChange={e => setRace(e.target.value as Race)} style={{ width: '100%' }}>
              {(Object.keys(PREFIXES) as Race[]).map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}>
            <label>Count: {count}</label>
            <input type="range" min={4} max={20} value={count} onChange={e => setCount(Number(e.target.value))} />
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={generate}>Generate Names</button>
        </div>
        {names.length > 0 && (
          <div className={styles.grid}>
            {names.map((n, i) => (
              <div key={i} className={styles.card} style={{ cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(n)}>
                <div className={styles.cardValue}>{n}</div>
                <div className={styles.cardLabel}>click to copy</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
