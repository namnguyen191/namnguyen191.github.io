import React, { memo, PropsWithChildren } from 'react';
import { NavbarContainer } from './NavbarStyles';

export type NavbarProps = {
  bgColor: string;
};
{
  /* Expected children:
<ul className="nav">
  <li className="nav-item">
    <a href="#home" title="Home" className="nav-link">
      <HomeIcon />
      <span className="link-text">Home</span>
    </a>
  </li>
  <li className="nav-item bottom"> // Note: only 1 item can be bottom, optional
    <a href="#home" title="Home" className="nav-link">
      <AccountCircleIcon />
      <span className="link-text">Home</span>
    </a>
  </li>
</ul>;
*/
}
const Navbar: React.FC<PropsWithChildren<NavbarProps>> = (props) => {
  const { children } = props;

  return <NavbarContainer {...props}>{children}</NavbarContainer>;
};

export default memo(Navbar);
