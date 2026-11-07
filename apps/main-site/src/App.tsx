import type { ReactElement } from 'react';

import { Footer } from './components/Footer/Footer';
import { Navbar } from './components/Navbar/Navbar';
import { Home } from './pages/Home/Home';

import styles from './App.module.scss';

export const App = (): ReactElement => (
  <div className={styles['app-container']}>
    <Navbar />
    <Home />
    <Footer />
  </div>
);
