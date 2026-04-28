import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CATEGORIES, CONVERTERS } from '../../converterCatalog';
import type { Category } from '../../types';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<Set<Category>>(new Set());

  function toggle(cat: Category) {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  return (
    <nav className={styles.nav} aria-label="Converter categories">
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
