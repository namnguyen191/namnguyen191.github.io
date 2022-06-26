import { ProjectCard } from './components/ProjectCard/ProjectCard';

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
      <ProjectCard
        description="A SIMPLE TRAVEL WEBSITE BUILT USING ADVANCE CSS TECHNIQUES"
        imgUrl="/natour.webp"
        stacks={['html', 'css', 'sass', 'bootstrap']}
        title="Natour Travel Website"
        githubUrl="https://github.com/namnguyen191/Natours"
        siteUrl="https://namnguyen191.github.io/Natours/"
        primaryColor="#28b485"
      />
    </div>
  );
};
