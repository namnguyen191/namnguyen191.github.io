import React from 'react';

import styles from './Home.module.scss';
import { SectionInfo } from './SectionInfo/SectionInfo';
import { SectionIntro } from './SectionIntro/SectionIntro';
import { SectionProjects } from './SectionProjects/SectionProjects';
import { SectionSkills } from './SectionSkills/SectionSkills';

export type HomeProps = {};

export const Home: React.FC<HomeProps> = (props) => {
  const {} = props;

  return (
    <div className={styles['home-container']}>
      <SectionIntro />
      <SectionInfo />
      <SectionSkills />
      <SectionProjects />
    </div>
  );
};
