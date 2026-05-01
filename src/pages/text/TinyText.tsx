import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './text.module.css';

const SUPERSCRIPT: Record<string, string> = {
  a:'ᵃ',b:'ᵇ',c:'ᶜ',d:'ᵈ',e:'ᵉ',f:'ᶠ',g:'ᵍ',h:'ʰ',i:'ⁱ',j:'ʲ',k:'ᵏ',l:'ˡ',
  m:'ᵐ',n:'ⁿ',o:'ᵒ',p:'ᵖ',q:'ᵠ',r:'ʳ',s:'ˢ',t:'ᵗ',u:'ᵘ',v:'ᵛ',w:'ʷ',x:'ˣ',y:'ʸ',z:'ᶻ',
  A:'ᴬ',B:'ᴮ',C:'ᶜ',D:'ᴰ',E:'ᴱ',F:'ᶠ',G:'ᴳ',H:'ᴴ',I:'ᴵ',J:'ᴶ',K:'ᴷ',L:'ᴸ',
  M:'ᴹ',N:'ᴺ',O:'ᴼ',P:'ᴾ',Q:'Q',R:'ᴿ',S:'ˢ',T:'ᵀ',U:'ᵁ',V:'ᵛ',W:'ᵂ',X:'ˣ',Y:'ʸ',Z:'ᶻ',
  '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹',
};

function toTiny(text: string) {
  return text.split('').map(c => SUPERSCRIPT[c] ?? c).join('');
}

export default function TinyText() {
  const [input, setInput] = useState('');
  const output = toTiny(input);

  return (
    <ConverterShell title="Tiny Text Generator" description="Convert text to tiny Unicode superscript characters for social media." category="text">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="tt-in">Input Text</label>
          <input id="tt-in" type="text" placeholder="Type something…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        {input && (
          <>
            <div className={styles.field}>
              <label>Tiny Text</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input readOnly value={output} style={{ flex: 1, fontSize: '1rem' }} />
                <button onClick={() => navigator.clipboard.writeText(output)}>Copy</button>
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ᵀⁱⁿʸ ᵗᵉˣᵗ ˡᵒᵒᵏˢ ˡⁱᵏᵉ ᵗʰⁱˢ ᵒⁿ ˢᵒᶜⁱᵃˡ ᵐᵉᵈⁱᵃ</p>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
