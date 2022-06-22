import React, { memo } from 'react';
import { FloatingCardContainer } from './FloatingCardStyles';

export type FloatingCardProps = {
  title: string;
  items: [string, string, string, string];
  imgSrc: string;
};

const FloatingCard: React.FC<FloatingCardProps> = (props) => {
  const { title, items, imgSrc } = props;

  return (
    <FloatingCardContainer>
      <img src={imgSrc} alt={`${title} icon`} />
      <h5>{title}</h5>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </FloatingCardContainer>
  );
};

export default memo(FloatingCard);
