import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './student.module.css';

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,'A': 4.0,'A-': 3.7,
  'B+': 3.3,'B': 3.0,'B-': 2.7,
  'C+': 2.3,'C': 2.0,'C-': 1.7,
  'D+': 1.3,'D': 1.0,'D-': 0.7,
  'F': 0.0,
};

interface Course { name: string; grade: string; credits: string; }

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([{ name: '', grade: 'A', credits: '3' }]);

  function addCourse() { setCourses([...courses, { name: '', grade: 'A', credits: '3' }]); }
  function update(i: number, k: keyof Course, v: string) {
    setCourses(courses.map((c, idx) => idx === i ? { ...c, [k]: v } : c));
  }

  const valid = courses.filter(c => c.grade in GRADE_POINTS && parseFloat(c.credits) > 0);
  const totalCredits = valid.reduce((s, c) => s + parseFloat(c.credits), 0);
  const totalPoints = valid.reduce((s, c) => s + GRADE_POINTS[c.grade] * parseFloat(c.credits), 0);
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : null;

  return (
    <ConverterShell title="GPA Calculator" description="Calculate your grade point average (GPA) from courses and letter grades." category="student">
      <div className={styles.form}>
        {courses.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem', alignItems: 'flex-end' }}>
            <input style={{ flex: 2, minWidth: 120 }} placeholder="Course name" value={c.name} onChange={e => update(i, 'name', e.target.value)} />
            <select value={c.grade} onChange={e => update(i, 'grade', e.target.value)}>
              {Object.keys(GRADE_POINTS).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <input style={{ width: 60 }} type="number" min="0.5" step="0.5" placeholder="Cr." value={c.credits} onChange={e => update(i, 'credits', e.target.value)} />
            <button onClick={() => setCourses(courses.filter((_, idx) => idx !== i))} disabled={courses.length === 1}>✕</button>
          </div>
        ))}
        <button onClick={addCourse}>+ Add course</button>
        {gpa && (
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>{gpa}</div><div className={styles.statLabel}>GPA</div></div>
            <div className={styles.stat}><div className={styles.statNum}>{totalCredits}</div><div className={styles.statLabel}>Total credits</div></div>
            <div className={styles.stat}><div className={styles.statNum}>{valid.length}</div><div className={styles.statLabel}>Courses</div></div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
