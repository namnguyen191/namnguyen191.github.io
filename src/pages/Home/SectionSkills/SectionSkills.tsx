import React, { memo } from 'react';

import FloatingCard from '../../../Components/FloatingCard/FloatingCard';
import { SectionSkillsContainer } from './SectionSkillsStyles';

export type SectionSkillsProps = {};

const SectionSkills: React.FC<SectionSkillsProps> = (props) => {
  const {} = props;

  return (
    <SectionSkillsContainer id="stacks">
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
          'GIT & GITHUB'
        ]}
        title="DEVOPS"
      />
    </SectionSkillsContainer>
  );
};

export default memo(SectionSkills);
