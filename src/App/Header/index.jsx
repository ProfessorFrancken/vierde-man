import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faComments } from '@fortawesome/free-solid-svg-icons';
import { useOnClickOutside } from 'hooks';
import Menu from 'App/Header/Menu';

const Prominent = ({ children }) => (
  <small className="text-monospace">{children === 33 ? "'Vo" : children}</small>
);

const Bar = styled.div`
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.secondaryWhite};
  border-bottom: thin solid ${({ theme }) => theme.primary};
`;
const Burger = ({ open, setOpen }) => {
  return (
    <div
      className="text-dark border-right p-2 px-3 h-100 d-flex align-items-center bg-light"
      onClick={() => setOpen(!open)}
    >
      <FontAwesomeIcon icon={open ? faTimes : faBars} fixedWidth />
    </div>
  );
};

const Header = (props) => {
  const [open, setOpen] = useState(false);
  const node = useRef();
  useOnClickOutside(node, () => setOpen(false));

  const wij = props.wij;
  const zij = props.zij;
  const rounds = props.rounds;
  const playerId = props.playerId;
  const playedTricks = props.playedTricks;

  return (
    <Bar className="d-flex justify-content-between align-items-center w-100">
      <div ref={node} className="h-100">
        <Burger open={open} setOpen={setOpen} />
        <Menu
          open={open}
          setOpen={setOpen}
          rounds={rounds}
          playedTricks={playedTricks}
          wij={wij}
          zij={zij}
          playerId={playerId}
        />
      </div>
      <div className="mr-auto p-2">
        Wij: <Prominent>{wij}</Prominent>
      </div>
      <div className="ml-auto 2 p-2 mr-2">
        Zij: <Prominent>{zij}</Prominent>
      </div>
    </Bar>
  );
};

export default Header;
