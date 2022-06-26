import React, { PropsWithChildren } from 'react';

import styles from './ToolTip.module.scss';

export type ToolTipProps = { text: string };

export const ToolTip: React.FC<PropsWithChildren<ToolTipProps>> = (
  props
) => {
  const { text, children } = props;

  return (
    <div className={styles['tool-tip-container']}>
      {children}
      <div className={styles['tool-tip-text']}>{text}</div>
    </div>
  );
};
