import { Link, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../../converterCatalog';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import type { Category } from '../../types';
import styles from './ConverterShell.module.css';

interface Props {
  title: string;
  description: string;
  category: Category;
  children: React.ReactNode;
}

export default function ConverterShell({ title, description, category, children }: Props) {
  const cat = CATEGORIES.find(c => c.id === category);
  const { pathname } = useLocation();

  useDocumentMeta({ title, description, path: pathname });

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link>
          <span>›</span>
          <span>{cat?.icon} {cat?.label}</span>
          <span>›</span>
          <span>{title}</span>
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>
      {children}
    </div>
  );
}
