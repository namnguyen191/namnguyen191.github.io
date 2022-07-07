import React from 'react';

import { BubbleDisplay } from '../../../components/BubbleDisplay/BubbleDisplay';
import { TypeWriter } from '../../../components/TypeWriter/TypeWriter';
import styles from './SectionIntro.module.scss';

export const SectionIntro: React.FC = () => {
  return (
    <div className={styles['section-intro-container']}>
      <div className={styles['head-lines']}>
        <h1>
          Nam Nguyen The{' '}
          <div className={styles['type-writer-container']}>
            <TypeWriter
              writerTexts={['Developer', 'Designer', 'Learner']}
              pauseTime={1500}
            />
          </div>
        </h1>
        <span>Welcome to my page!</span>
      </div>

      <div className={styles['top-3-projects']}>
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
    </div>
  );
};
