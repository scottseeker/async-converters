import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './random.module.css';

const YES = ['Yes!','Absolutely!','Definitely!','Of course!','Without a doubt!','Signs point to yes.','Go for it!'];
const NO = ['No.','Absolutely not.','Nope.','Don\'t count on it.','My sources say no.','Outlook not so good.','Very doubtful.'];

export default function YesNo() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isYes, setIsYes] = useState(false);

  function decide() {
    const yes = Math.random() > 0.5;
    setIsYes(yes);
    const arr = yes ? YES : NO;
    setAnswer(arr[Math.floor(Math.random() * arr.length)]);
  }

  return (
    <ConverterShell title="Yes or No?" description="Ask a question and get a definitive yes or no answer." category="random">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="yn-q">Your question</label>
          <input id="yn-q" type="text" placeholder="Should I go for a walk?" value={question} onChange={e => setQuestion(e.target.value)} />
        </div>
        <div className={styles.actions} style={{ justifyContent: 'center' }}>
          <button onClick={decide}>Ask!</button>
        </div>
        {answer && (
          <div style={{ textAlign: 'center', padding: '2rem', borderRadius: 16, background: isYes ? '#2ecc7120' : '#e74c3c20', border: `2px solid ${isYes ? '#2ecc71' : '#e74c3c'}` }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{isYes ? '✅' : '❌'}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: isYes ? '#2ecc71' : '#e74c3c' }}>{answer}</div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
