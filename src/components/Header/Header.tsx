import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { CATEGORIES, CONVERTERS } from '../../converterCatalog';
import styles from './Header.module.css';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim().length > 0
    ? CONVERTERS.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.keywords.some(k => k.includes(query.toLowerCase()))
      ).slice(0, 10)
    : [];

  const categoryLabel = (catId: string) =>
    CATEGORIES.find(c => c.id === catId)?.label ?? catId;

  function handleSelect(path: string) {
    setQuery('');
    setOpen(false);
    navigate(path);
  }

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        ⚡ <span>Async<span className={styles.logoAccent}>Converters</span></span>
      </Link>

      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          ref={inputRef}
          className={styles.searchInput}
          type="search"
          placeholder="Search converters…"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          aria-label="Search converters"
          autoComplete="off"
        />
        {open && query.trim().length > 0 && (
          <div className={styles.dropdown} role="listbox">
            {results.length === 0 ? (
              <p className={styles.noResults}>No converters found</p>
            ) : (
              results.map(r => (
                <div key={r.path}>
                  <div className={styles.dropdownCategory}>{categoryLabel(r.category)}</div>
                  <a
                    className={styles.dropdownItem}
                    role="option"
                    aria-selected="false"
                    href={r.path}
                    onClick={e => { e.preventDefault(); handleSelect(r.path); }}
                  >
                    <span>{r.name}</span>
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className={styles.spacer} />

      <button
        className={styles.themeToggle}
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}
