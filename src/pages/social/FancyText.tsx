import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './social.module.css';

const STYLES: Record<string, [string, string][]> = {
  Bold: [['a','𝗮'],['b','𝗯'],['c','𝗰'],['d','𝗱'],['e','𝗲'],['f','𝗳'],['g','𝗴'],['h','𝗵'],['i','𝗶'],['j','𝗷'],['k','𝗸'],['l','𝗹'],['m','𝗺'],['n','𝗻'],['o','𝗼'],['p','𝗽'],['q','𝗾'],['r','𝗿'],['s','𝘀'],['t','𝘁'],['u','𝘂'],['v','𝘃'],['w','𝘄'],['x','𝘅'],['y','𝘆'],['z','𝘇'],['A','𝗔'],['B','𝗕'],['C','𝗖'],['D','𝗗'],['E','𝗘'],['F','𝗙'],['G','𝗚'],['H','𝗛'],['I','𝗜'],['J','𝗝'],['K','𝗞'],['L','𝗟'],['M','𝗠'],['N','𝗡'],['O','𝗢'],['P','𝗣'],['Q','𝗤'],['R','𝗥'],['S','𝗦'],['T','𝗧'],['U','𝗨'],['V','𝗩'],['W','𝗪'],['X','𝗫'],['Y','𝗬'],['Z','𝗭']],
  Italic: [['a','𝘢'],['b','𝘣'],['c','𝘤'],['d','𝘥'],['e','𝘦'],['f','𝘧'],['g','𝘨'],['h','𝘩'],['i','𝘪'],['j','𝘫'],['k','𝘬'],['l','𝘭'],['m','𝘮'],['n','𝘯'],['o','𝘰'],['p','𝘱'],['q','𝘲'],['r','𝘳'],['s','𝘴'],['t','𝘵'],['u','𝘶'],['v','𝘷'],['w','𝘸'],['x','𝘹'],['y','𝘺'],['z','𝘻'],['A','𝘈'],['B','𝘉'],['C','𝘊'],['D','𝘋'],['E','𝘌'],['F','𝘍'],['G','𝘎'],['H','𝘏'],['I','𝘐'],['J','𝘑'],['K','𝘒'],['L','𝘓'],['M','𝘔'],['N','𝘕'],['O','𝘖'],['P','𝘗'],['Q','𝘘'],['R','𝘙'],['S','𝘚'],['T','𝘛'],['U','𝘜'],['V','𝘝'],['W','𝘞'],['X','𝘟'],['Y','𝘠'],['Z','𝘡']],
  Script: [['a','𝓪'],['b','𝓫'],['c','𝓬'],['d','𝓭'],['e','𝓮'],['f','𝓯'],['g','𝓰'],['h','𝓱'],['i','𝓲'],['j','𝓳'],['k','𝓴'],['l','𝓵'],['m','𝓶'],['n','𝓷'],['o','𝓸'],['p','𝓹'],['q','𝓺'],['r','𝓻'],['s','𝓼'],['t','𝓽'],['u','𝓾'],['v','𝓿'],['w','𝔀'],['x','𝔁'],['y','𝔂'],['z','𝔃'],['A','𝓐'],['B','𝓑'],['C','𝓒'],['D','𝓓'],['E','𝓔'],['F','𝓕'],['G','𝓖'],['H','𝓗'],['I','𝓘'],['J','𝓙'],['K','𝓚'],['L','𝓛'],['M','𝓜'],['N','𝓝'],['O','𝓞'],['P','𝓟'],['Q','𝓠'],['R','𝓡'],['S','𝓢'],['T','𝓣'],['U','𝓤'],['V','𝓥'],['W','𝓦'],['X','𝓧'],['Y','𝓨'],['Z','𝓩']],
};

function applyStyle(text: string, styleName: string) {
  const map = new Map(STYLES[styleName] ?? []);
  return text.split('').map(c => map.get(c) ?? c).join('');
}

export default function FancyText() {
  const [input, setInput] = useState('');
  const [active, setActive] = useState('Bold');

  const preview = applyStyle(input, active);

  return (
    <ConverterShell title="Fancy Text Generator" description="Generate stylized Unicode text for social media bios and posts." category="social">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="ft-in">Input Text</label>
          <input id="ft-in" type="text" placeholder="Type your text…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div className={styles.grid}>
          {Object.keys(STYLES).map(name => (
            <div key={name} className={`${styles.card} ${active === name ? styles.cardActive ?? '' : ''}`} style={active === name ? { borderColor: 'var(--accent)' } : {}} onClick={() => setActive(name)}>
              <div className={styles.cardLabel}>{name}</div>
              <div className={styles.cardValue}>{applyStyle(input || 'Sample', name)}</div>
            </div>
          ))}
        </div>
        {input && (
          <>
            <div className={styles.field}>
              <label>Preview ({active})</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input readOnly value={preview} style={{ flex: 1 }} />
                <button onClick={() => navigator.clipboard.writeText(preview)}>Copy</button>
              </div>
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
