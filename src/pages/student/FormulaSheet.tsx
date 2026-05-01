import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './student.module.css';

const FORMULAS = [
  {
    section: 'Algebra',
    items: [
      { name: 'Quadratic Formula', formula: 'x = (-b ± √(b²-4ac)) / 2a', note: 'Solves ax²+bx+c=0' },
      { name: 'Slope', formula: 'm = (y₂-y₁) / (x₂-x₁)' },
      { name: 'Slope-intercept', formula: 'y = mx + b' },
      { name: 'Distance', formula: 'd = √((x₂-x₁)² + (y₂-y₁)²)' },
      { name: 'Midpoint', formula: 'M = ((x₁+x₂)/2, (y₁+y₂)/2)' },
    ],
  },
  {
    section: 'Geometry',
    items: [
      { name: 'Circle area', formula: 'A = πr²' },
      { name: 'Circle circumference', formula: 'C = 2πr' },
      { name: 'Triangle area', formula: 'A = ½ × base × height' },
      { name: "Pythagorean theorem", formula: 'a² + b² = c²' },
      { name: 'Sphere volume', formula: 'V = (4/3)πr³' },
      { name: 'Cylinder volume', formula: 'V = πr²h' },
    ],
  },
  {
    section: 'Physics',
    items: [
      { name: "Newton's 2nd law", formula: 'F = ma' },
      { name: 'Kinetic energy', formula: 'KE = ½mv²' },
      { name: 'Potential energy', formula: 'PE = mgh' },
      { name: 'Work', formula: 'W = F × d × cos(θ)' },
      { name: 'Speed', formula: 'v = d / t' },
      { name: "Ohm's law", formula: 'V = IR' },
      { name: 'Power', formula: 'P = IV = V²/R = I²R' },
    ],
  },
  {
    section: 'Statistics',
    items: [
      { name: 'Mean', formula: 'x̄ = Σx / n' },
      { name: 'Std deviation (sample)', formula: 's = √(Σ(x-x̄)² / (n-1))' },
      { name: 'Probability', formula: 'P(A) = favorable / total' },
      { name: 'Compound interest', formula: 'A = P(1 + r/n)^(nt)' },
    ],
  },
  {
    section: 'Trigonometry',
    items: [
      { name: 'sin', formula: 'sin(θ) = opposite / hypotenuse' },
      { name: 'cos', formula: 'cos(θ) = adjacent / hypotenuse' },
      { name: 'tan', formula: 'tan(θ) = opposite / adjacent' },
      { name: 'Law of cosines', formula: 'c² = a² + b² - 2ab·cos(C)' },
      { name: 'Law of sines', formula: 'a/sin(A) = b/sin(B) = c/sin(C)' },
    ],
  },
];

export default function FormulaSheet() {
  return (
    <ConverterShell title="Formula Sheet" description="Quick reference for common math and physics formulas." category="student">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {FORMULAS.map(({ section, items }) => (
          <div key={section}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)' }}>{section}</h3>
            <div className={styles.grid}>
              {items.map(({ name, formula, note }) => (
                <div key={name} className={styles.card}>
                  <div className={styles.cardLabel}>{name}</div>
                  <div className={styles.cardValue} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>{formula}</div>
                  {note && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{note}</div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ConverterShell>
  );
}
