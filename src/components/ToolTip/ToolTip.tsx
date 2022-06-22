import React, { memo, PropsWithChildren } from 'react';
import { ToolTipContainer, ToolTipText } from './ToolTipStyles';

export type ToolTipProps = {
  text: string;
};

const ToolTip: React.FC<PropsWithChildren<ToolTipProps>> = (props) => {
  const { children, text } = props;

  return (
    <ToolTipContainer>
      {children}
      <ToolTipText>{text}</ToolTipText>
    </ToolTipContainer>
  );
};

export default memo(ToolTip);
