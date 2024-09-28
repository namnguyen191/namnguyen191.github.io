import React from 'react';

import { FloatingCard } from '../../../components/FloatingCard/FloatingCard';
import styles from './SectionSkills.module.scss';

export const SectionSkills: React.FC = () => {
  return (
    <section className={styles['section-skills-container']} id="stacks">
      <FloatingCard
        imgSrc="/front-end.svg"
        items={[
          'HTML | CSS | JAVASCRIPT',
          'ANGULAR | REACT | REDUX',
          'Webpack | WASM',
          'FIGMA | ADOBEXD'
        ]}
        title="FRONT-END"
      />
      <FloatingCard
        imgSrc="/development.svg"
        items={[
          'NODEJS WITH EXPRESS',
          'ASP.NET',
          'NestJS',
          'MVC | WEB API'
        ]}
        title="BACK-END"
      />
      <FloatingCard
        imgSrc="/database.svg"
        items={['MYSQL', 'MONGODB', 'POSTGRES', 'SQL SERVER']}
        title="DATABASE"
      />
      <FloatingCard
        imgSrc="/deployment.svg"
        items={[
          'TRAVIS CI | JENKINS',
          'DOCKER | KUBERNETES',
          'AWS | GOOGLE CLOUD | HEROKU',
          'GIT & GITHUB | NX Monorepo'
        ]}
        title="DEVOPS"
      />
    </section>
  );
};
