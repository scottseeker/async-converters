import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Layout.module.css';

const YEAR = new Date().getFullYear();
const COPYRIGHT = `© 2025${YEAR > 2025 ? `\u2013${YEAR}` : ''} Async Labs Inc. All rights reserved.`;

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.body}>
        <nav className={styles.sidebar}>
          <Sidebar />
        </nav>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
      <footer className={styles.footer}>{COPYRIGHT}</footer>
    </div>
  );
}
