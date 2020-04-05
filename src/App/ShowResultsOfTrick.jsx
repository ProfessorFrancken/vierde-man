import React, { useState, useEffect } from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import Card from 'Components/Card';
import { WinnerOfTrick, PointsOfTrick } from 'GameLogic/Card';
import _ from 'lodash';
import styled from 'styled-components';
import Modal from 'Components/Modal';
import PlayerName from 'Components/PlayerName';

const Prominent = ({ children }) => (
  <span>{children === 33 ? "'Vo" : children}</span>
);

const CardWrapper = styled.div`
  --cardScale: 1.5;

  li {
    box-shadow: none !important;
    transform: rotate(0deg) !important;
  }
`;

const PlayedCards = ({ playedCards, winner }) => (
  <ul className="list-unstyled d-flex justify-content-between mb-0">
    {_.map(playedCards, (card, idx) => (
      <CardWrapper className="mx-2" winner={winner === card.playedBy} key={idx}>
        <Card
          card={card}
          onClick={() => {}}
          disabled={card.playedBy !== winner}
        />
      </CardWrapper>
    ))}
  </ul>
);

const CheckContinueAutomatically = ({ checked, onChange }) => (
  <div className="form-group form-check text-muted mb-0">
    <input
      type="checkbox"
      className="form-check-input"
      id="continueAutomatically"
      checked={checked}
      onChange={onChange}
    />
    <label className="form-check-label" htmlFor="continueAutomatically">
      Continue next trick automatically
    </label>
  </div>
);

export const Bid = ({ bid }) => {
  if (bid.bid === null) {
    return <span>Pass</span>;
  }

  return (
    <span className="">
      <strong className="mr-2">{bid.bid}</strong>
      <SuitStringToComponent suit={bid.suit} />
    </span>
  );
};

const ShowResultsOfTrick = ({
  moves,
  continueNextTrick,
  currentTrick: { playedCards, startingPlayer },
  trump,
  playerId,
  currentPlayer,
  continueTrickAutomatically = {}
}) => {
  const winner = WinnerOfTrick(playedCards, playedCards[startingPlayer], trump);
  const points = PointsOfTrick(playedCards, trump);
  const [continueAutomatically, setContinueAutomatically] = useState(
    continueTrickAutomatically[currentPlayer] === true
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (continueTrickAutomatically[currentPlayer]) {
        moves.ContinueToNextTrick(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPlayer, continueTrickAutomatically, moves]);

  // The cards given are not in the order in which they were played,
  // so we will have to manually order them based on the starting player
  const playedCardsInOrder = _.concat(
    ..._(playedCards)
      .reject(card => card === undefined)
      .partition(({ playedBy }) => playedBy < startingPlayer)
      .reverse()
      .values()
  );

  return (
    <Modal.Dialog style={{ zIndex: 'var(--modal-z-index)' }}>
      <Modal.Header>
        <Modal.Title>
          <PlayerName playerId={winner} /> won the trick
        </Modal.Title>
        <ul className="list-unstyled mb-0 d-flex justify-content-between text-muted">
          <li>
            <strong>Points </strong>: <Prominent>{points.points}</Prominent>
          </li>
          {points.honor > 0 && (
            <li>
              <strong>Honor </strong>: <Prominent>{points.honor}</Prominent>
            </li>
          )}
        </ul>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <PlayedCards playedCards={playedCardsInOrder} winner={winner} />
      </Modal.Body>
      <Modal.Body className="border-top">
        <CheckContinueAutomatically
          checked={continueAutomatically}
          onChange={() => setContinueAutomatically(!continueAutomatically)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Modal.Actions>
          <Modal.Action
            onClick={() => moves.ContinueToNextTrick(continueAutomatically)}
          >
            Continue
          </Modal.Action>
        </Modal.Actions>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default ShowResultsOfTrick;
