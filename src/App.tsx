import { Navbar } from './components/Navbar/Navbar';

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
      <Navbar />
    </div>
  );
};
