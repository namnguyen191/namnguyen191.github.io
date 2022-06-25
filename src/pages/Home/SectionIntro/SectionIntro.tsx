import React, { memo } from 'react';

import BubbleDisplay from '../../../Components/BubbleDisplay/BubbleDisplay';
import TypeWriter from '../../../Components/TypeWriter/TypeWriter';
import { SectionIntroContainer } from './SectionIntroStyles';

const SectionIntro: React.FC = () => {
  return (
    <SectionIntroContainer id="home">
      <div className="head-lines">
        <h1>
          Nam Nguyen The{' '}
          <div className="type-writer-container">
            <TypeWriter
              writerTexts={['Developer', 'Designer', 'Learner']}
              pauseTime={1500}
            />
          </div>
        </h1>
        <span>Welcome to my page!</span>
      </div>

      <div className="top-3-projects">
        <h2>Top 3 Projects</h2>
        <BubbleDisplay
          title="Natours"
          description="Sass | Advanced CSS"
          imgUr="/natour.webp"
          url="https://namnguyen191.github.io/Natours/"
        />
        <BubbleDisplay
          title="Sirvey"
          description="MERN stack"
          imgUr="/survey.webp"
          url="https://reactsirvey.herokuapp.com/"
        />
        <BubbleDisplay
          title="DatingApp"
          description="Angular | .net core"
          imgUr="/dating-app-crop.webp"
          url="https://dotnet5-datingapp.herokuapp.com/"
        />
      </div>
    </SectionIntroContainer>
  );
};

export default memo(SectionIntro);
