import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './tcg.module.css';

// Hypergeometric distribution: probability of drawing exactly k successes in n draws
// from a population of N with K successes
// P(X >= 1) = 1 - P(X = 0)

function hypergeom(N: number, K: number, n: number, k: number): number {
  // P(X = k) = C(K,k) * C(N-K, n-k) / C(N, n)
  function logC(a: number, b: number): number {
    if (b < 0 || b > a) return -Infinity;
    if (b === 0 || b === a) return 0;
    let r = 0;
    for (let i = 0; i < b; i++) r += Math.log(a - i) - Math.log(i + 1);
    return r;
  }
  return Math.exp(logC(K, k) + logC(N - K, n - k) - logC(N, n));
}

function probAtLeastOne(N: number, K: number, n: number): number {
  return Math.max(0, Math.min(1, 1 - hypergeom(N, K, n, 0)));
}

export default function MtgDrawOdds() {
  const [deckSize, setDeckSize] = useState(60);
  const [copies, setCopies] = useState(4);
  const [drawCount, setDrawCount] = useState(7);
  const [mulliganed, setMulliganed] = useState(false);

  const N = deckSize;
  const K = copies;
  const draws = [drawCount, drawCount + 1, drawCount + 2, drawCount + 3, drawCount + 4, drawCount + 5, drawCount + 10];

  function pct(p: number) { return (p * 100).toFixed(1) + '%'; }

  const openingProb = probAtLeastOne(N, K, drawCount);
  const mulliganDraw = mulliganed ? drawCount - 1 : drawCount;
  const afterMulligan = mulliganed
    ? 1 - ((1 - probAtLeastOne(N, K, drawCount)) * (1 - probAtLeastOne(N, K, mulliganDraw)))
    : openingProb;

  return (
    <ConverterShell
      title="MTG Draw Probability"
      description="Hypergeometric probability of drawing specific cards in your opening hand or by a certain turn."
      category="tcg"
    >
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Deck size</label>
            <input type="number" min={1} max={250} value={deckSize}
              onChange={e => setDeckSize(Math.max(1, Number(e.target.value)))} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Copies in deck</label>
            <input type="number" min={0} max={deckSize} value={copies}
              onChange={e => setCopies(Math.min(deckSize, Math.max(0, Number(e.target.value))))} />
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 100 }}>
            <label>Opening hand size</label>
            <input type="number" min={1} max={deckSize} value={drawCount}
              onChange={e => setDrawCount(Math.max(1, Number(e.target.value)))} />
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={mulliganed} onChange={e => setMulliganed(e.target.checked)} />
          Account for 1 mulligan
        </label>

        {/* Opening hand probability */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-card)', border: '2px solid var(--accent)', borderRadius: 'var(--radius)', padding: '0.75rem 1.25rem', minWidth: 160 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.07em' }}>Opening Hand ({drawCount} cards)</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent)' }}>{pct(openingProb)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>≥1 copy</div>
          </div>
          {mulliganed && (
            <div style={{ background: 'var(--bg-card)', border: '2px solid #9b59b6', borderRadius: 'var(--radius)', padding: '0.75rem 1.25rem', minWidth: 160 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.07em' }}>After Mulligan</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#9b59b6' }}>{pct(afterMulligan)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>≥1 copy either hand</div>
            </div>
          )}
        </div>

        {/* Probability over more draws (by turn) */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>By number of cards drawn</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.35rem 0.6rem', textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Cards drawn</th>
                  <th style={{ padding: '0.35rem 0.6rem', textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>P(≥1 copy)</th>
                  <th style={{ padding: '0.35rem 0.6rem', textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Bar</th>
                </tr>
              </thead>
              <tbody>
                {draws.map(d => {
                  const p = probAtLeastOne(N, K, Math.min(d, N));
                  return (
                    <tr key={d}>
                      <td style={{ padding: '0.3rem 0.6rem', borderBottom: '1px solid var(--border)', fontWeight: d === drawCount ? 700 : undefined, color: d === drawCount ? 'var(--accent)' : undefined }}>
                        {d === drawCount ? `${d} (opening)` : `${d} (+${d - drawCount})`}
                      </td>
                      <td style={{ padding: '0.3rem 0.6rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>{pct(p)}</td>
                      <td style={{ padding: '0.3rem 0.6rem', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ height: 10, width: `${Math.round(p * 200)}px`, maxWidth: 200, background: 'var(--accent)', borderRadius: 3 }} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ConverterShell>
  );
}
