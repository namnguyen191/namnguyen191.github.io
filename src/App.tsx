import { FloatingCard } from './components/FloatingCard/FloatingCard';

export const App: React.FC = () => {
  return (
    <div style={{ height: '200vh' }}>
      <FloatingCard
        imgSrc="/front-end.svg"
        items={[
          'HTML | CSS | JAVASCRIPT',
          'SASS | BOOTSTRAP | MATERIALIZE',
          'FIGMA | ADOBEXD',
          'REACT & REDUX | ANGULAR'
        ]}
        title="FRONT-END"
      />
    </div>
  );
};
