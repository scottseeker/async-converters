import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './student.module.css';

export default function FlashcardPicker() {
  const [input, setInput] = useState('');
  const [current, setCurrent] = useState<{ front: string; back: string } | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<number[]>([]);

  function parseCards() {
    return input.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
      const sep = l.indexOf('|');
      return sep > -1
        ? { front: l.slice(0, sep).trim(), back: l.slice(sep + 1).trim() }
        : { front: l, back: '(no answer)' };
    });
  }

  function next() {
    const cards = parseCards();
    if (!cards.length) return;
    const remaining = cards.map((_, i) => i).filter(i => !seen.includes(i));
    if (remaining.length === 0) { setSeen([]); return; }
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setSeen(s => [...s, pick]);
    setCurrent(cards[pick]);
    setFlipped(false);
  }

  const cards = parseCards();

  return (
    <ConverterShell title="Flashcard Picker" description="Enter question|answer pairs and study with random flashcard prompts." category="student">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="fc-in">Flashcards (one per line: question | answer)</label>
          <textarea id="fc-in" style={{ minHeight: 140 }} placeholder={'What is H2O? | Water\nCapital of France | Paris'} value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.actions}>
          <button onClick={next} disabled={cards.length === 0}>Next Card</button>
          {seen.length > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{seen.length} / {cards.length} seen</span>}
        </div>
        {current && (
          <div
            style={{ padding: '2rem', border: '2px solid var(--border)', borderRadius: 12, textAlign: 'center', cursor: 'pointer', minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem', background: 'var(--bg-card)' }}
            onClick={() => setFlipped(f => !f)}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{flipped ? 'Answer' : 'Question'}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{flipped ? current.back : current.front}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>click to {flipped ? 'show question' : 'reveal answer'}</div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
