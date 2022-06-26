import { TypeWriter } from './components/TypeWriter/TypeWriter';

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
      <h1>
        Nam Nguyen The{' '}
        <div className="type-writer-container">
          <TypeWriter
            writerTexts={['Developer', 'Designer', 'Learner']}
            pauseTime={1500}
          />
        </div>
      </h1>
    </div>
  );
};
