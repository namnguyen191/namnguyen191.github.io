import { BubbleDisplay } from './components/BubbleDisplay/BubbleDisplay';

export const App: React.FC = () => {
  return (
    <div style={{ height: '200vh' }}>
      <BubbleDisplay
        title="Natours"
        description="Sass | Advanced CSS"
        imgUr="/natour.webp"
        url="https://namnguyen191.github.io/Natours/"
      />
    </div>
  );
};
