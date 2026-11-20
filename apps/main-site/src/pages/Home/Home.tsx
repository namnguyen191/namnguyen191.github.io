import type { ReactElement } from 'react';

import { SectionInfo } from './SectionInfo/SectionInfo';
import { SectionIntro } from './SectionIntro/SectionIntro';
import { SectionProjects } from './SectionProjects/SectionProjects';
import { SectionSkills } from './SectionSkills/SectionSkills';

import styles from './Home.module.scss';

export const Home = (): ReactElement => (
  <div className={styles['home-container']}>
    <SectionIntro />
    <SectionInfo />
    <SectionSkills />
    <SectionProjects />
  </div>
);
