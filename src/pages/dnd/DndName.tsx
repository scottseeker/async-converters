import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './dnd.module.css';

const PREFIXES = {
  human:    ['Ad','Al','Bal','Cor','Dan','Ed','Gar','Hal','Ian','Jak','Lor','Mal','Ren','Tar','Val'],
  elf:      ['Aer','Ara','Cel','Ely','Gal','Ith','Lor','Nae','Riv','Syl','Ael','Car','Fen','Mir','Thal'],
  dwarf:    ['Bog','Bru','Dur','Gim','Gor','Kaz','Mor','Rok','Thor','Ul','Bald','Dain','Hre','Oin','Thr'],
  orc:      ['Azu','Bru','Drak','Grak','Korg','Mol','Naz','Rak','Skul','Thrak','Gash','Krak','Mag','Rog','Zug'],
  halfling: ['Bil','Fil','Fro','Mer','Pip','Rob','Sam','Tom','Will','Wise','Bun','Cot','Ham','Per','Ros'],
  tiefling: ['Ash','Cal','Dem','Mal','Mor','Nyx','Phe','Rel','Tar','Zar','Ado','Cre','Kae','Sar','Vel'],
  dragonborn:['Arjhan','Balasar','Bharash','Dal','Eben','Ghesh','Hej','Idris','Irhtos','Kriv','Medrash','Mehen','Nadarr','Patt','Shand'],
};
const SUFFIXES = {
  human:    ['and','ard','as','en','or','us','win','wyn','ian','on','ir','eth'],
  elf:      ['ath','diel','ion','iras','ith','las','lis','riel','rion','are','ven'],
  dwarf:    ['ain','ak','din','dur','gin','in','ok','on','ur','ig','ul'],
  orc:      ['ag','ak','ash','gat','kag','nar','ok','rag','zug','ash','rok'],
  halfling: ['bo','ey','fie','foot','kins','rose','shire','son','wise','wick'],
  tiefling: ['ia','iel','ius','or','us','yn','rae','iel','ara','en'],
  dragonborn:['','','','',''], // full names
};

type Race = keyof typeof PREFIXES;

function randItem<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function DndName() {
  const [race, setRace] = useState<Race>('human');
  const [count, setCount] = useState(8);
  const [names, setNames] = useState<string[]>([]);
  const [copied, setCopied] = useState(-1);

  function generate() {
    setNames(Array.from({ length: count }, () => {
      if (race === 'dragonborn') return randItem(PREFIXES.dragonborn);
      const pre = randItem(PREFIXES[race]);
      const suf = randItem(SUFFIXES[race].filter(s => s));
      return pre + suf;
    }));
  }

  function copy(n: string, i: number) {
    navigator.clipboard.writeText(n).catch(() => {});
    setCopied(i);
    setTimeout(() => setCopied(-1), 1200);
  }

  return (
    <ConverterShell title="D&D Character Name Generator" description="Generate fantasy RPG character names for different D&D races." category="dnd">
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label>Race</label>
            <select value={race} onChange={e => setRace(e.target.value as Race)}>
              {(Object.keys(PREFIXES) as Race[]).map(r => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Count: {count}</label>
            <input type="range" min={4} max={24} value={count} onChange={e => setCount(Number(e.target.value))} />
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={generate}>Generate Names</button>
        </div>
        {names.length > 0 && (
          <div className={styles.grid}>
            {names.map((n, i) => (
              <div key={i} className={styles.card} onClick={() => copy(n, i)}>
                <div className={styles.cardValue}>{n}</div>
                <div className={styles.cardLabel}>{copied === i ? '✓ Copied!' : 'click to copy'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
