import { AnimatedLink } from './components/AnimatedLink/AnimatedLink';

export const App: React.FC = () => {
  return (
    <div style={{ height: '200vh' }}>
      <AnimatedLink
        linkName="@LinkedIn: Nam Nguyen"
        url="https://www.linkedin.com/in/nam-nguyen-865226132"
      />
    </div>
  );
};
