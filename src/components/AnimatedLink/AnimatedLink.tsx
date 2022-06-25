import React from 'react';

import styles from './AnimatedLink.module.scss';

export type AnimatedLinkProps = {
  linkName: string;
  url: string;
};

const AnimatedLink: React.FC<AnimatedLinkProps> = (props) => {
  const { linkName, url } = props;

  return (
    <span className={styles['animated-link-container']}>
      <a href={url} target="_blank" rel="noreferrer">
        {linkName}
      </a>
    </span>
  );
};

export { AnimatedLink };
