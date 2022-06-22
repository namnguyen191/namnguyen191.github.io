import React, { memo, PropsWithChildren } from 'react';
import { FooterContainer } from './FooterStyles';

export type FooterProps = {};

const Footer: React.FC<PropsWithChildren<FooterProps>> = (props) => {
  const { children } = props;

  return <FooterContainer>{children}</FooterContainer>;
};

export default memo(Footer);
