import styled from 'styled-components';

import { NavbarProps } from './Navbar';
import chroma from 'chroma-js';

const dynamicFontColor = (props: NavbarProps) => {
  return chroma(props.bgColor).luminance() >= 0.7 ? '#41418a' : '#edece8';
};

const dynamicContrastColor = (props: NavbarProps) => {
  return chroma(props.bgColor).luminance() >= 0.7
    ? chroma(props.bgColor).darken(0.5).hex()
    : chroma(props.bgColor).brighten(0.5).hex();
};

export const NavbarContainer = styled.nav<NavbarProps>`
  z-index: 999;
  position: fixed;
  background-color: ${({ bgColor }) => bgColor};
  transition: width 200ms ease-in;

  .nav {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  .nav-item {
    width: 100%;
  }

  .nav-link {
    display: flex;
    align-items: center;
    height: 4.5rem;
    text-decoration: none;
    font-size: 2.5rem;
    min-width: 1.8rem;
    margin: 0.8rem 0.5rem;
    color: ${dynamicFontColor};
    filter: grayscale(100%) opacity(0.7);
    transition: 300ms;

    &:hover {
      filter: grayscale(0) opacity(1);
      background: ${dynamicContrastColor};
      color: #fff;
    }
  }

  .MuiSvgIcon-root {
    font-size: 3rem;
  }

  .link-text {
    margin-left: 4rem;
    opacity: 0;
    transform: translateX(-13rem);
    transition: all 300ms;
  }

  @media only screen and (min-width: 1200px) {
    top: 0;
    left: 0;
    width: 4.5rem; // match the first grid column width
    height: 100vh;

    &:hover {
      width: 20rem;

      .link-text {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .bottom {
      margin-top: auto;
    }
  }

  @media only screen and (max-width: 1200px) {
    bottom: 0;
    width: 100%;
    height: 6rem;

    .nav {
      flex-direction: row;
    }

    .nav-link {
      justify-content: center;
    }

    .link-text {
      display: none;
    }
  }
`;
