import React from 'react';
import styled from 'styled-components';
import PlayerName from 'Components/PlayerName';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTimes, faCogs } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Card from 'Components/Card';
import TreeTable from 'App/TreeTable';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const Prominent = ({ children }) => (
  <small className="text-monospace text-muted">
    {children === 33 ? "'Vo" : children}
  </small>
);

const CardWrapper = styled.div`
  --cardScale: 1.5;

  li {
    box-shadow: none !important;
    transform: rotate(0deg) !important;
  }
`;

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
  @media (min-width: 576px) {
    min-width: 25em;
  }

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
    <StyledMenu open={open} className="bg-white  shadow">
      <button
        onClick={() => setOpen(false)}
        className="btn btn-text rounded-0 text-white bg-primary p-3 d-flex justify-content-between align-items-center"
      >
        <h4 className="h6 mb-0 text-white">Close menu</h4>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <div className="d-flex justify-content-between align-items-center p-3 bg-white border-bottom text-center text-muted">
        <div className="d-flex flex-column text-left">
          <h6>Wij</h6>
          <small>
            <PlayerName playerId={0} />
          </small>
          <small className="mb-2">
            <PlayerName playerId={2} />
          </small>
          <Prominent>{wij}</Prominent>
        </div>
        <div className="text-monospace text-center">
          Round
          <br />
          {rounds.length + 1} / 16
        </div>
        <div className="d-flex flex-column text-right">
          <h6>Zij</h6>
          <small>
            <PlayerName playerId={1} />
          </small>
          <small className="mb-2">
            <PlayerName playerId={3} />
          </small>
          <Prominent>{zij}</Prominent>
        </div>
      </div>
      {playedTricks.length > 0 && (
        <div className="p-3 border-bottom">
          <PlayedCards lastTrick={playedTricks[playedTricks.length - 1]} />
        </div>
      )}
      <TreeTable rounds={rounds} />
      <Link
        to="/lobby"
        className="bg-light border-top p-3 justify-self-end d-flex justify-content-start align-items-center mt-auto"
      >
        <FontAwesomeIcon icon={faUsers} fixedWidth className="text-dark" />
        <div className="px-3 d-flex flex-column">
          <h4 className="h6 mb-0 text-muted">Back to lobby</h4>
        </div>
      </Link>
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
    </StyledMenu>
  );
};

export default Menu;
