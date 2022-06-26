import React from 'react';

import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
  return (
    <footer className={styles['footer-container']}>
      &copy; 2021 by Nam Nguyen. All rights reserved. &nbsp;
      <a href="https://github.com/namnguyen191/nextjs-portfolio">
        Free to use for learning purposes.
      </a>
    </footer>
  );
};
