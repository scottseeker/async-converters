import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './gaming.module.css';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RandomTeam() {
  const [input, setInput] = useState('');
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);

  function divide() {
    const players = input.split('\n').map(l => l.trim()).filter(Boolean);
    if (players.length < teamCount) return;
    const shuffled = shuffle(players);
    const result: string[][] = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((p, i) => result[i % teamCount].push(p));
    setTeams(result);
  }

  return (
    <ConverterShell title="Random Team Divider" description="Randomly split a list of players into equal teams." category="gaming">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="rt-players">Players (one per line)</label>
          <textarea id="rt-players" style={{ minHeight: 160 }} placeholder={'Alice\nBob\nCharlie\nDave\nEve\nFrank'} value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.field} style={{ maxWidth: 200 }}>
          <label htmlFor="rt-count">Number of teams: {teamCount}</label>
          <input id="rt-count" type="range" min={2} max={8} value={teamCount} onChange={e => setTeamCount(Number(e.target.value))} />
        </div>
        <div className={styles.actions}>
          <button onClick={divide}>Divide Teams</button>
        </div>
        {teams.length > 0 && (
          <div className={styles.grid}>
            {teams.map((team, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardLabel}>Team {i + 1}</div>
                {team.map((p, j) => <div key={j} className={styles.cardValue} style={{ marginTop: j > 0 ? '0.25rem' : 0 }}>{p}</div>)}
              </div>
            ))}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
