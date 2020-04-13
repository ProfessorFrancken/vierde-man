import React, { useState, useRef } from 'react';
import { Bid } from 'App/PlaceBid';
import styled from 'styled-components';
import PlayerName from 'Components/PlayerName';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faUsers,
  faTree,
  faBars,
  faTimes,
  faComments,
  faCogs,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useOnClickOutside } from 'hooks';
import Card from 'Components/Card';
import _ from 'lodash';
const CardWrapper = styled.div`
  --cardScale: 1.5;

  li {
    box-shadow: none !important;
    transform: rotate(0deg) !important;
  }
`;

const Prominent = ({ children }) => (
  <small className="text-monospace text-muted">
    {children === 33 ? "'Vo" : children}
  </small>
);

const Bar = styled.div``;
const StyledMenu = styled.nav`
  overflow-y: auto;
  max-height: 100vh;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  text-align: left;

  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  transition: transform 0.2s ease-in-out;

  @media (max-width: 576px) {
    width: 100%;
  }

  a:hover {
    color: #343078;
  }
`;

const PlayedCards = ({ lastTrick }) => {
  const { startingPlayer, winner } = lastTrick;

  const playedCards = _.concat(
    ..._(lastTrick.cards)
      .reject((card) => card === undefined)
      .partition(({ playedBy }) => playedBy < startingPlayer)
      .reverse()
      .values()
  );

  return (
    <div>
      <h4 className="h5">Last trick</h4>
      <h6>
        Won by{' '}
        <strong>
          <PlayerName playerId={winner} />
        </strong>
      </h6>
      <ul className="list-unstyled d-flex justify-content-between mb-0 flex-wrap">
        {_.map(playedCards, (card, idx) => (
          <CardWrapper
            className="mx-2 my-2"
            winner={winner === card.playedBy}
            key={card.playedBy}
          >
            <Card
              card={card}
              onClick={() => {}}
              disabled={card.playedBy !== winner}
              onlyShowCorners
            />
          </CardWrapper>
        ))}
      </ul>
    </div>
  );
};
const Menu = ({ rounds, playedTricks, wij, zij, open, setOpen, playerId }) => {
  return (
    <StyledMenu open={open} className="bg-white border-right shadow">
      <div
        className="text-white border-bottom p-3 d-flex justify-content-between align-items-center"
        style={{ backgroundColor: '#173249' }}
      >
        <FontAwesomeIcon icon={faTimes} onClick={() => setOpen(false)} />
        <h4 className="h6 mb-0 text-white">Vierde man?</h4>
      </div>
      <div className="list-unstyled p-3 bg-white border-bottom text-center text-muted">
        Round {rounds.length + 1} / 16
      </div>
      <div className="list-unstyled p-3 bg-white border-bottom">
        <div className="d-flex justify-content-between  font-weight-bold">
          <h4 className="h6">Wij</h4>
          <small>
            <Prominent>{wij} </Prominent>
          </small>
        </div>
        <ul
          className="list-unstyled d-flex justify-content-between font-weight-light mb-0"
          style={{ fontSize: '0.8rem' }}
        >
          <li>
            <PlayerName playerId={0} />
          </li>
          <li>
            <PlayerName playerId={2} />
          </li>
        </ul>
      </div>
      <div className="list-unstyled p-3 bg-white border-bottom">
        <div className="d-flex justify-content-between  font-weight-bold">
          <h4 className="h6">Zij</h4>
          <small>
            <Prominent>{zij} </Prominent>
          </small>
        </div>
        <ul
          className="list-unstyled d-flex justify-content-between font-weight-light mb-0"
          style={{ fontSize: '0.8rem' }}
        >
          <li>
            <PlayerName playerId={1} />
          </li>
          <li>
            <PlayerName playerId={3} />
          </li>
        </ul>
      </div>
      {playedTricks.length > 0 && (
        <div className="p-3 border-bottom">
          <PlayedCards lastTrick={playedTricks[playedTricks.length - 1]} />
        </div>
      )}
      <button
        className="btn bg-light border-bottom p-3 justify-self-end d-flex justify-content-start align-items-center"
        onClick={() => alert('Sorry, this has not yet been implemented')}
      >
        <FontAwesomeIcon icon={faTree} fixedWidth className="text-dark" />
        <div className="px-3 d-flex flex-column">
          <h4 className="h6 mb-0 text-muted">View previous scores</h4>
        </div>
      </button>

      <a
        href="/lobby"
        className="bg-light border-top p-3 justify-self-end d-flex justify-content-start align-items-center mt-auto"
      >
        <FontAwesomeIcon icon={faUsers} fixedWidth className="text-dark" />
        <div className="px-3 d-flex flex-column">
          <h4 className="h6 mb-0 text-muted">Back to lobby</h4>
        </div>
      </a>
      <button
        className="btn bg-light border-top p-3 justify-self-end d-flex justify-content-start align-items-center"
        onClick={() => alert('Sorry, this has not yet been implemented')}
      >
        <FontAwesomeIcon icon={faCogs} fixedWidth className="text-dark" />
        <div className="px-3 d-flex flex-column">
          <h4 className="h6 mb-0 text-muted">Settings</h4>
        </div>
      </button>
      <a
        href="https://github.com/ProfessorFrancken/vierde-man"
        className="bg-light border-top p-3 justify-self-end d-flex justify-content-start align-items-center"
      >
        <FontAwesomeIcon icon={faGithub} className="text-dark" fixedWidth />
        <div className="px-3 d-flex flex-column">
          <h4 className="h6 mb-0 text-muted">Github</h4>
        </div>
      </a>

      <button
        className="btn bg-light border-top p-3 justify-self-end d-flex justify-content-start align-items-center"
        onClick={() => alert('Sorry, this has not yet been implemented')}
      >
        <FontAwesomeIcon icon={faUser} fixedWidth className="text-dark" />
        <img
          alt=""
          src=""
          width="50px"
          height="50px"
          style={{ objectFit: 'cover' }}
          className="bg-white rounded-circle border border-white d-none"
        />
        <div className="px-3 d-flex flex-column">
          <h4 className="h6 mb-1">
            <PlayerName playerId={playerId} />
          </h4>
          <small className="text-muted">View profile</small>
        </div>
      </button>
    </StyledMenu>
  );
};

const Burger = ({ open, setOpen }) => {
  return (
    <div
      className="border-right p-2 px-3 h-100 d-flex align-items-center bg-light"
      onClick={() => setOpen(!open)}
    >
      <FontAwesomeIcon icon={open ? faTimes : faBars} fixedWidth />
    </div>
  );
};

const InformationBar = (props) => {
  const [open, setOpen] = useState(false);
  const node = useRef();
  useOnClickOutside(node, () => setOpen(false));

  const wij = props.wij;
  const zij = props.zij;
  const bid = props.bid;
  const rounds = props.rounds;
  const playerId = props.playerId;
  const playedTricks = props.playedTricks;

  return (
    <Bar className="bg-white d-flex justify-content-between align-items-center w-100 shadow">
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
      <div className="ml-auto 2 p-2">
        Zij: <Prominent>{zij}</Prominent>
      </div>
      <div
        className="border-left p-2 px-3 h-100 d-flex align-items-center bg-light d-none"
        onClick={() => alert('Sorry, this has not yet been implemented')}
      >
        <FontAwesomeIcon icon={faComments} />
      </div>
    </Bar>
  );
};

export default InformationBar;
