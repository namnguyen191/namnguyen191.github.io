import React from 'react';

import styles from './Home.module.scss';
import { SectionIntro } from './SectionIntro/SectionIntro';

export type HomeProps = {};

export const Home: React.FC<HomeProps> = (props) => {
  const {} = props;

  return (
    <div className={styles['home-container']}>
      <SectionIntro />
    </div>
  );
};
