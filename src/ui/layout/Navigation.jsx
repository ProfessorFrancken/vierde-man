import React, { useState } from 'react';
import styled from 'styled-components';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faUser,
  faSignOutAlt,
  faUsers,
  faChartBar,
  faBars,
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

const NavLi = styled.li`
  background-color: ${({ theme, active }) =>
    active ? theme.primary : theme.primaryDark};
`;
const Separator = styled.li`
  margin: auto;
`;
const NavigationStyle = styled.nav`
  z-index: 2;
  div,
  ul {
    background-color: ${({ theme }) => theme.primaryDark};
  }

  ul {
    width: 100%;
    margin-top: ${({ active }) => (active ? '0' : '-150%')};
    transition: margin-top 400ms ease-in-out;

    @media (min-width: 576px) {
      margin-top: ${({ active }) => (active ? '0' : '-100%')};
      transition: margin-top 600ms ease-in-out;
    }

    @media (min-width: 768px) {
      height: 100%;
      margin-top: 0;
    }
  }
`;

export const Navigation = () => {
  const [active, setActive] = useState(false);

  return (
    <NavigationStyle
      className="francken-navigation text-white font-weight-bold h-md-100 position-relative"
      active={active}
    >
      <div className="d-flex d-md-none justify-content-end align-items-center">
        <div
          className="text-center py-3 py-sm-4 px-3 d-flex justify-content-end align-items-center"
          onClick={() => setActive(!active)}
        >
          <div className="d-none d-sm-block">Vierdeman?</div>

          <div className="ml-3 py-1 px-2 bg-primary">
            <FontAwesomeIcon icon={faBars} className="text-white" fixedWidth />
          </div>
        </div>
      </div>
      <ul className="list-unstyled text-left d-one d-md-flex flex-column mb-0 pt-5 pt-md-4 pb-2 text-muted">
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
