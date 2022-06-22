import React, { memo } from 'react';

import { BubbleDisplayContainer } from './BubbleDisplayStyles';

export type BubbleDisplayProps = {
  imgUr: string;
  title: string;
  description: string;
  url: string;
};

const BubbleDisplay: React.FC<BubbleDisplayProps> = (props) => {
  const { imgUr, title, description, url } = props;

  return (
    <BubbleDisplayContainer>
      <img src={imgUr} alt={`${title} image`} />
      <div className="text-container">
        <a href={url} target="_blank">
          <span className="title">{title}</span>
        </a>
        <span className="description">{description}</span>
      </div>
    </BubbleDisplayContainer>
  );
};

export default memo(BubbleDisplay);
