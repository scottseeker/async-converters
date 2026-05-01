import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './student.module.css';

export default function StudentPicker() {
  const [input, setInput] = useState('');
  const [picked, setPicked] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const students = input.split('\n').map(l => l.trim()).filter(Boolean);

  function pick() {
    if (!students.length) return;
    const remaining = students.filter(s => !history.includes(s));
    const pool = remaining.length > 0 ? remaining : students;
    if (remaining.length === 0) setHistory([]);
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setPicked(chosen);
    setHistory(h => [...h, chosen]);
  }

  return (
    <ConverterShell title="Random Student Picker" description="Randomly pick a student from your class list without repeats." category="student">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="sp-in">Class list (one student per line)</label>
          <textarea id="sp-in" style={{ minHeight: 160 }} placeholder={'Alice\nBob\nCharlie\nDave'} value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.actions}>
          <button onClick={pick} disabled={students.length === 0}>Pick Student</button>
          <button onClick={() => { setHistory([]); setPicked(''); }}>Reset</button>
          {history.length > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{history.length}/{students.length} picked</span>}
        </div>
        {picked && (
          <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--accent)', color: '#fff', borderRadius: 12, fontSize: '1.5rem', fontWeight: 700 }}>
            🎯 {picked}
          </div>
        )}
        {history.length > 0 && (
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Already picked:</p>
            {history.map((s, i) => <span key={i} style={{ fontSize: '0.8rem', marginRight: '0.5rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{s}</span>)}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
