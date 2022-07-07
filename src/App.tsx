import styles from './App.module.scss';
import { Footer } from './components/Footer/Footer';
import { Navbar } from './components/Navbar/Navbar';
import { Home } from './pages/Home/Home';

export const App: React.FC = () => {
  return (
    <div className={styles['app-container']}>
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
};
