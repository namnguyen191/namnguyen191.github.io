import { ToBeContinuedCard } from './components/CustomEndingCard/ToBeContinuedCard';

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
      <ToBeContinuedCard />
    </div>
  );
};
