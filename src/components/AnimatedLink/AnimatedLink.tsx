import React from 'react';

import { AnimatedLinkContainer } from './AnimatedLinkStyles';

export type AnimatedLinkProps = {
  linkName: string;
  url: string;
};

const AnimatedLink: React.FC<AnimatedLinkProps> = (props) => {
  const { linkName, url } = props;

  return (
    <AnimatedLinkContainer>
      <a href={url} target="_blank" rel="noreferrer">
        {linkName}
      </a>
    </AnimatedLinkContainer>
  );
};

export { AnimatedLink };
