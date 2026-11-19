import type { ComponentProps, ReactElement, ReactNode } from 'react';

import './Button.scss';

export type ButtonVariant = 'primary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ComponentProps<'button'> {
  /** The visual style. `primary` is for the one main action in a view. */
  variant?: ButtonVariant;
  /** How big the button is: its height, padding and text size. */
  size?: ButtonSize;
  /** The label. */
  children?: ReactNode;
  /** Shows the button as unavailable. It can't be clicked or focused. */
  disabled?: boolean;
  /**
   * What the button does inside a form. Defaults to `button`, unlike a native `<button>` (which
   * defaults to `submit`), so it never submits a form by accident.
   */
  type?: ComponentProps<'button'>['type'];
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: ButtonProps): ReactElement => {
  const combinedClassName = [
    'nam-button',
    `nam-button--${variant}`,
    `nam-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // The rule wants a literal `type`. Ours is always set: it defaults to `button` above.
  // oxlint-disable-next-line react/button-has-type
  return <button {...rest} type={type} className={combinedClassName} />;
};
