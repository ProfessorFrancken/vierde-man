import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Francken } from 'assets/LOGO_KAAL.svg';

const StyledHeader = styled.div`
  --skew-degrees: 30deg;
  --negative-skew-degrees: -30deg;

  .header__logo {
    color: white;
    padding: 1em;
    background-color: ${({ theme }) => theme.primary};
    width: 100%;

    svg {
      z-index: 10;
      max-height: 40px;
      max-width: 100%;
    }
  }

  .header__title {
    font-size: 1em;
    line-height: 1.1;
    font-weight: 500;
    font-family: $headings-font-family;

    margin-left: auto;
    margin-right: auto;
  }

  .header__title-link {
    width: 100%;
    color: white;

    // Make both the logo and "T.F.V 'Professor Francken'" show in the mobile menu
    z-index: 202;
    position: relative;

    &:hover,
    &:focus {
      color: white;
      text-decoration: none;
    }
  }

  @media (min-width: 768px) {
    .header__title-link {
      width: initial;
    }

    .navigation__hamburger-menu,
    .navigation-list {
      display: none;
    }

    .header__logo {
      padding: 2em 1em;
      padding-right: 5em;
      text-align: right;
      border-radius: 0px 0px 10px 0px;

      svg {
        max-height: 60px;
      }
    }

    .header__title {
      font-size: 1.75rem;
      margin: 0 0 0 1em;
    }
  }

  @media (min-width: 1200px) {
    .header__logo {
      padding: 2em 1em;
      padding-right: 5em;

      svg {
        max-height: 80px;
      }
    }
  }

  .header__logo {
    z-index: 2;
  }
  .navigation-container__wrapper {
    z-index: 1;
  }
  .navigation__menu-item {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  @media (min-width: 768px) {
    .header__logo {
      width: 200px;
      padding-right: 3em;
    }

    .navigation-container__wrapper {
      margin-left: -200px;
    }
  }
  @media (min-width: 992px) {
    .navigation__menu-item {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }
    .header__logo {
      width: 300px;
      padding-right: 5em;
    }

    .navigation-container__wrapper {
      margin-left: -300px;
    }
  }

  .skew--top-right {
    transform: skewX(var(--negative-skew-degrees));
    border-radius: 0px 0px 10px 0px;
    transform-origin: top right;
  }

  .skew--top-right > * {
    transform: skewX(var(--skew-degrees));
  }

  // Currently not used as we only skew the footer for medium devices
  .skew--bottom-right {
    transform: skewX(var(--skew-degrees));
    border-radius: 0px 10px 0px 0px;
    transform-origin: bottom right;
  }

  .skew--bottom-right > * {
    transform: skewX(var(--negative-skew-degrees));
  }

  // Used for the footer
  @media (min-width: 992px) {
    .skew-md--top-right {
      transform: skewX(var(--negative-skew-degrees));
      border-radius: 0px 0px 10px 0px;
      transform-origin: top right;
    }

    .skew-md--top-right > * {
      transform: skewX(var(--skew-degrees));
    }
  }
`;

const Header = () => {
  return (
    <StyledHeader className="francken-header d-flex justify-content-between">
      <div
        className="header__logo h-100 flex-grow-1 flex-md-grow-0 skew-md--top-right d-flex flex-md-column justify-content-end justify-content-md-end"
        style={{ boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.8)' }}
      >
        <a
          className="header__title-link justify-content-begin justify-content-md-end align-items-center d-inline-flex p-md-4"
          href="/"
        >
          <Francken height="100px" width="100px" />
          <span className="d-md-none header__title">Vierde man?</span>
        </a>
      </div>
      <div className="header flex-grow-1"></div>
    </StyledHeader>
  );
};

const NavLi = styled.li`
  background-color: ${({ theme, active }) =>
    active ? theme.primary : theme.primaryDark};
`;
const NavigationStyle = styled.nav`
  background-color: ${({ theme }) => theme.primaryDark};
`;
const Navigation = () => {
  return (
    <NavigationStyle className="francken-navigation text-white font-weight-bold">
      <ul className="list-unstyled text-center">
        <NavLi className="my-3 p-4">
          <div className="d-flex justify-content-center align-items-center">
            <img
              alt=""
              src="https://randomuser.me/api/portraits/women/91.jpg"
              className="rounded-circle mr-3"
              height="50px"
            />
            Profile
          </div>
        </NavLi>
        <NavLi active className="my-3 p-4">
          Lobby
        </NavLi>
        <NavLi className="my-3 p-4">Statistics</NavLi>
      </ul>
    </NavigationStyle>
  );
};

const LayoutStyle = styled.div`
  // Set the border width of the border above the navigation
  --top-stroke-width: 0.75em;
  border-top: var(--top-stroke-width) solid ${({ theme }) => theme.primary};

  display: grid;

  grid-template-areas:
    'header content side'
    'nav content side'
    'footer footer footer';

  grid-template-columns: 250px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-gap: 0;

  height: 100vh;

  .francken-header {
    grid-area: header;
  }

  .francken-navigation {
    grid-area: nav;
  }

  .francken-content {
    grid-area: content;
  }
`;

const Layout = ({ children }) => {
  return (
    <LayoutStyle className="francken-layout">
      <Header className="francken-header" />
      <Navigation className="francken-navigation" />
      <main className="francken-content">{children}</main>
    </LayoutStyle>
  );
};

export default Layout;
