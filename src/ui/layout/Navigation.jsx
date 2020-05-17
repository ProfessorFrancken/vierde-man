import React, { useState, useRef } from 'react';
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
import { useOnClickOutside } from 'hooks';

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
  .bg-dark-primary {
    background-color: ${({ theme }) => theme.primaryDark};
  }

  .navigation-items {
    transition: margin-top 400ms ease-in-out;
    margin-top: ${({ active }) => (active ? '0' : '-150%')};

    @media (min-width: 576px) {
      margin-top: ${({ active }) => (active ? '0' : '-100%')};
    }

    @media (min-width: 768px) {
      height: 100%;
      margin-top: 0;
    }
  }
`;

export const Navigation = () => {
  const [active, setActive] = useState(false);
  const node = useRef();
  useOnClickOutside(node, () => setActive(false));

  return (
    <NavigationStyle
      ref={node}
      className="francken-navigation text-white font-weight-bold h-md-100 position-relative"
      active={active}
    >
      <div className="d-flex d-md-none justify-content-end align-items-center bg-dark-primary">
        <div
          className="text-center py-2 px-3 d-flex justify-content-end align-items-center"
          onClick={() => setActive(!active)}
        >
          <div className="d-none d-sm-block">Vierdeman?</div>

          <div className="ml-3 py-1 px-2 bg-primary">
            <FontAwesomeIcon icon={faBars} className="text-white" fixedWidth />
          </div>
        </div>
      </div>
      <ul className="navigation-items list-unstyled text-left d-one d-md-flex flex-column mb-0 pt-5 pt-md-4 pb-2 text-muted bg-dark-primary">
        <NavLi active className="p-4 text-white">
          <FontAwesomeIcon
            icon={faUsers}
            className="text-muted mr-3"
            fixedWidth
          />
          Lobby
        </NavLi>
        <NavLi className="p-4 d-none">
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
        <NavLi className="p-4 d-none">
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
