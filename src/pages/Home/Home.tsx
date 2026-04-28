import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, CONVERTERS } from '../../converterCatalog';
import styles from './Home.module.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() =>
    q
      ? CONVERTERS.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.keywords.some(k => k.includes(q))
        )
      : CONVERTERS,
    [q]
  );

  const hasResults = filtered.length > 0;

  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <h1>⚡ Async Converters</h1>
        <p>Free, fast, browser-based conversion tools — no sign-up, no server, no data sent anywhere.</p>
      </div>

      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search all converters…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search converters"
        />
      </div>

      {!hasResults && (
        <p className={styles.noResults}>No converters match "{query}"</p>
      )}

      <div className={styles.categories}>
        {CATEGORIES.map(cat => {
          const converters = filtered.filter(c => c.category === cat.id);
          if (converters.length === 0) return null;
          return (
            <section key={cat.id} className={styles.category}>
              <h2 className={styles.categoryTitle}>
                <span>{cat.icon}</span> {cat.label}
              </h2>
              <div className={styles.grid}>
                {converters.map(c => (
                  <Link key={c.path} to={c.path} className={styles.card}>
                    <div className={styles.cardName}>{c.name}</div>
                    <div className={styles.cardDesc}>{c.description}</div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
