import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CodeIcon from '@mui/icons-material/Code';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';
import LayersIcon from '@mui/icons-material/Layers';
import React from 'react';

import styles from './Navbar.module.scss';

export type NavbarProps = {};

export const Navbar: React.FC<NavbarProps> = (props) => {
  const {} = props;

  return (
    <nav className={styles['navbar']}>
      <ul className={styles['nav']}>
        <li className={styles['nav-item']}>
          <a href="#home" title="Home" className={styles['nav-link']}>
            <HomeIcon fontSize="large" />
            <span className={styles['link-text']}>Home</span>
          </a>
        </li>

        <li className={styles['nav-item']}>
          <a href="#about" title="About" className={styles['nav-link']}>
            <AccountCircleIcon fontSize="large" />
            <span className={styles['link-text']}>About</span>
          </a>
        </li>

        <li className={styles['nav-item']}>
          <a href="#stacks" title="Stacks" className={styles['nav-link']}>
            <LayersIcon fontSize="large" />
            <span className={styles['link-text']}>Stacks</span>
          </a>
        </li>

        <li className={styles['nav-item']}>
          <a
            href="#projects"
            title="Projects"
            className={styles['nav-link']}
          >
            <CodeIcon fontSize="large" />
            <span className={styles['link-text']}>Projects</span>
          </a>
        </li>

        <li className={`${styles['nav-item']} ${styles['bottom']}`}>
          <a
            href="https://github.com/namnguyen191"
            title="GitHub"
            target="_blank"
            className={styles['nav-link']}
            rel="noreferrer"
          >
            <GitHubIcon fontSize="large" />
            <span className={styles['link-text']}>Github</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};
