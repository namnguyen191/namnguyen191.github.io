import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Footer />
    </div>
  );
};
