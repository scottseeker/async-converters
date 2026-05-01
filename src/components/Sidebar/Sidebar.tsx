import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CATEGORIES, CONVERTERS } from '../../converterCatalog';
import type { Category } from '../../types';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<Set<Category>>(new Set());

  const allCollapsed = collapsed.size === CATEGORIES.length;

  function toggle(cat: Category) {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  function toggleAll() {
    if (allCollapsed) {
      setCollapsed(new Set());
    } else {
      setCollapsed(new Set(CATEGORIES.map(c => c.id)));
    }
  }

  return (
    <nav className={styles.nav} aria-label="Converter categories">
      <div className={styles.navHeader}>
        <span className={styles.navTitle}>Tools</span>
        <button
          className={styles.toggleAll}
          onClick={toggleAll}
          title={allCollapsed ? 'Expand all' : 'Collapse all'}
          aria-label={allCollapsed ? 'Expand all sections' : 'Collapse all sections'}
        >
          {allCollapsed ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4.5L7 9.5L12 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 9.5L7 4.5L12 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
      {CATEGORIES.map(cat => {
        const converters = CONVERTERS.filter(c => c.category === cat.id);
        const isCollapsed = collapsed.has(cat.id);
        return (
          <div key={cat.id} className={styles.category}>
            <div
              className={styles.categoryHeader}
              onClick={() => toggle(cat.id)}
              role="button"
              aria-expanded={!isCollapsed}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && toggle(cat.id)}
            >
              <span className={styles.categoryIcon}>{cat.icon}</span>
              {cat.label}
              <span style={{ marginLeft: 'auto' }}>{isCollapsed ? '›' : '⌄'}</span>
            </div>
            {!isCollapsed && (
              <div className={styles.links}>
                {converters.map(c => (
                  <NavLink
                    key={c.path}
                    to={c.path}
                    className={({ isActive }) =>
                      `${styles.link}${isActive ? ` ${styles.linkActive}` : ''}`
                    }
                  >
                    {c.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
