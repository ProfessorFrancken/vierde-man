import React, { useState, useEffect } from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import Card from 'Components/Card';
import { WinnerOfTrick, PointsOfTrick } from 'GameLogic/Card';
import _ from 'lodash';
import styled, { css } from 'styled-components';
import Modal from 'Components/Modal';

const Prominent = ({ children }) => (
  <span>{children === 33 ? "'Vo" : children}</span>
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

const CardWrapper = styled.div`
  li {
    box-shadow: none !important;
    transform: rotate(0deg) !important;

    ${({ winner }) =>
      winner &&
      1 == 2 &&
      css`
        border-color: #252525 !important;
      `}
  }
`;

const ShowResultsOfTrick = ({
  moves,
  continueNextTrick,
  currentTrick: { playedCards, startingPlayer },
  trump,
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
    <Modal.Dialog style={{ zIndex: 10 }}>
      <Modal.Header>
        <Modal.Title>Player {winner} won the trick</Modal.Title>
        <ul className="list-unstyled mb-0 d-flex justify-content-between text-muted">
          <li className="text-center">
            <strong>Points </strong>: <Prominent>{points.points}</Prominent>
          </li>
          {points.honor > 0 && (
            <li className="text-center">
              <strong>Honor </strong>: <Prominent>{points.honor}</Prominent>
            </li>
          )}
        </ul>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <ul className="list-unstyled d-flex justify-content-between">
          {_.map(playedCardsInOrder, (card, idx) => {
            return (
              <CardWrapper
                className="mx-2"
                winner={winner === card.playedBy}
                key={idx}
              >
                <Card
                  card={card}
                  onClick={() => {}}
                  cardScale={1.5}
                  disabled={card.playedBy !== winner}
                />
              </CardWrapper>
            );
          })}
        </ul>
      </Modal.Body>
      <Modal.Body className="border-top">
        <div className="form-group form-check text-muted mb-0">
          <input
            type="checkbox"
            className="form-check-input"
            id="continueAutomatically"
            checked={continueAutomatically}
            onChange={() => setContinueAutomatically(!continueAutomatically)}
          />
          <label className="form-check-label" htmlFor="continueAutomatically">
            Continue next trick automatically
          </label>
        </div>
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
