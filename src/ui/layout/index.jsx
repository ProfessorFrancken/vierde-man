import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Francken } from 'assets/LOGO_KAAL.svg';
import { faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';
import {
  faUser,
  faSignOutAlt,
  faUsers,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLobby } from 'lobby/context';

const LogoutButton = () => {
  const { exitLobby } = useLobby();

  return (
    <button
      onClick={exitLobby}
      className="p-4 btn btn-text text-muted text-left"
    >
      <FontAwesomeIcon
        icon={faSignOutAlt}
        className="text-muted mr-3"
        fixedWidth
      />
      Logout
    </button>
  );
};

const StyledHeader = styled.div`
  --skew-degrees: 30deg;
  --negative-skew-degrees: -30deg;

  --skew-degrees: 30deg;
  --negative-skew-degrees: -30deg;
  background-color: ${({ theme }) => theme.primary};
  position: relative;

  height: 9em;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.primary};
    transform: skewX(var(--negative-skew-degrees));
    border-radius: 0px 0px 10px 0px;
    transform-origin: bottom right;
  }

  a {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .header__logo {
    color: white;
    background-color: ${({ theme }) => theme.primary};
    width: 100%;
    z-index: 2;

    svg {
      z-index: 10;
      max-height: 40px;
      max-width: 100%;
    }
  }

  @media (min-width: 768px) {
    .header__logo {
      border-radius: 0px 0px 10px 0px;
      width: 200px;

      svg {
        max-height: 60px;
      }
    }
  }

  @media (min-width: 992px) {
    .header__logo {
      width: 300px;
    }
  }

  @media (min-width: 1200px) {
    .header__logo {
      svg {
        max-height: 80px;
      }
    }
  }
`;

const Header = () => {
  return (
    <StyledHeader className="francken-header">
      <div className="header__logo">
        <a className="header__title-link d-inline-flex flex-column" href="/">
          <Francken height="130px" width="130px" />
        </a>
      </div>
    </StyledHeader>
  );
};

const NavLi = styled.li`
  background-color: ${({ theme, active }) =>
    active ? theme.primary : theme.primaryDark};
`;
const Separator = styled.li`
  margin: auto;
`;
const NavigationStyle = styled.nav`
  background-color: ${({ theme }) => theme.primaryDark};
`;
const Navigation = () => {
  return (
    <NavigationStyle className="francken-navigation text-white font-weight-bold">
      <ul className="list-unstyled text-left d-flex flex-column h-100 mb-0 pt-4 pb-2 text-muted">
        <NavLi active className="p-4 text-white">
          <FontAwesomeIcon
            icon={faUsers}
            className="text-muted mr-3"
            fixedWidth
          />
          Lobby
        </NavLi>
        <NavLi className="p-4">
          <FontAwesomeIcon
            icon={faChartBar}
            className="text-muted mr-3"
            fixedWidth
          />
          Statistics
        </NavLi>
        <Separator />
        <NavLi className="p-4 text-left">
          <a
            href="https://github.com/ProfessorFrancken/vierde-man"
            className="text-muted"
          >
            <FontAwesomeIcon
              icon={faGithub}
              className="text-muted mr-3"
              fixedWidth
            />
            Github
          </a>
        </NavLi>
        <NavLi className="p-4">
          <div className="d-flex justify-content-start align-items-center">
            <FontAwesomeIcon
              icon={faUser}
              className="text-muted mr-3"
              fixedWidth
            />
            Profile
          </div>
        </NavLi>
        <LogoutButton />
      </ul>
    </NavigationStyle>
  );
};

const StyledAside = styled.aside`
  grid-area: side;
  overflow: auto;
`;
const Aside = () => {
  return (
    <StyledAside className="m-4 ml-5 p-4 bg-light">
      <div className="alert alert-primary flex-grow-1 mb-4">
        <FontAwesomeIcon icon={faDiscord} className="mr-2" fixedWidth />
        Join the{' '}
        <a
          href="https://discord.gg/gHb2jUq"
          className="font-weight-bold"
          target="_blank"
          rel="noopener noreferrer"
        >
          Francken Discord
        </a>{' '}
        to chat while playing .
      </div>

      <h3>Klaverjas rules</h3>
      <table className="table my-4 border-bottom ">
        <thead>
          <tr>
            <th className="text-right">Trump</th>
            <th>Points</th>
            <th className="text-right">Non-trump</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-right">Jack</td>
            <td>20</td>
            <td className="text-right">Ace</td>
            <td>11</td>
          </tr>
          <tr>
            <td className="text-right">9</td>
            <td>14</td>
            <td className="text-right">10</td>
            <td>10</td>
          </tr>
          <tr>
            <td className="text-right">Ace</td>
            <td>11</td>
            <td className="text-right">King</td>
            <td>4</td>
          </tr>
          <tr>
            <td className="text-right">10</td>
            <td>10</td>
            <td className="text-right">Queen</td>
            <td>3</td>
          </tr>
          <tr>
            <td className="text-right">King</td>
            <td>4</td>
            <td className="text-right">Jack</td>
            <td>2</td>
          </tr>
          <tr>
            <td className="text-right">Queen</td>
            <td>3</td>
            <td className="text-right">9</td>
            <td>0</td>
          </tr>
          <tr>
            <td className="text-right">8</td>
            <td>0</td>
            <td className="text-right">8</td>
            <td>0</td>
          </tr>
          <tr>
            <td className="text-right">7</td>
            <td>0</td>
            <td className="text-right">7</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
      <h5>Honor</h5>
      <p className="text-muted">
        Feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper
        morbi? Risus pretium quam vulputate dignissim suspendisse in est ante in
        nibh mauris, cursus mattis molestie a, iaculis at erat pellentesque.
      </p>
      <h5>Bidding</h5>
      <p className="text-muted">
        Quisque sagittis, purus sit amet volutpat consequat, mauris nunc congue.
      </p>
      <h5>Seinen</h5>
      <p className="text-muted">
        Amet facilisis magna etiam tempor, orci eu lobortis elementum, nibh.
      </p>
      <h5>Concepts</h5>
      <p className="text-muted">
        Nisi, vitae suscipit tellus mauris a diam maecenas.
      </p>
    </StyledAside>
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

  grid-template-columns: 18em 1fr minmax(35em, 200px);
  grid-template-rows: auto 1fr auto;
  grid-column-gap: 0em;

  min-height: 100vh;
  max-height: 100vh;
  min-width: 100%;

  .francken-header {
    grid-area: header;
    margin-right: 5em;
  }

  .francken-navigation {
    grid-area: nav;
    margin-right: 5em;
    position: sticky;
  }

  .francken-content {
    grid-area: content;
    overflow: auto;
  }
`;

const Layout = ({ children }) => {
  return (
    <LayoutStyle className="francken-layout">
      <Header className="francken-header" />
      <Navigation className="francken-navigation" />
      <main className="francken-content my-4">{children}</main>
      <Aside />
    </LayoutStyle>
  );
};

export default Layout;
