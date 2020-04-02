import React, { useState, useEffect } from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import Card from 'Components/Card';
import { WinnerOfTrick, PointsOfTrick } from 'GameLogic/Card';
import _ from 'lodash';
import styled, { css } from 'styled-components';

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
  game,
  moves,
  continueNextTrick,
  playerId,
  currentPlayer
}) => {
  const [continueAutomatically, setContinueAutomatically] = useState(
    (game.continueTrickAutomatically &&
      game.continueTrickAutomatically[currentPlayer]) === true
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        game.continueTrickAutomatically &&
        game.continueTrickAutomatically[currentPlayer]
      ) {
        moves.ContinueToNextTrick(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPlayer, game.continueTrickAutomatically, moves]);

  // The cards given are not in the order in which they were played,
  // so we will have to manually order them based on the starting player
  const playedCards = _.concat(
    ..._(game.currentTrick.playedCards)
      .reject(card => card === undefined)
      .partition(({ playedBy }) => playedBy < game.currentTrick.startingPlayer)
      .reverse()
      .values()
  );

  const winner = WinnerOfTrick(
    game.currentTrick.playedCards,
    game.currentTrick.playedCards[game.currentTrick.startingPlayer],
    game.bid.trump
  );
  const points = PointsOfTrick(game.currentTrick.playedCards, game.bid.trump);
  return (
    <>
      <div className="bg-white rounded shadow text-left" style={{ zIndex: 10 }}>
        <div className="">
          <div className="p-3">
            <h3 className="h5">Player {winner} won the trick</h3>
            <ul className="list-unstyled mb-0 d-flex justify-content-between text-muted">
              <li className="text-center">
                <strong>Points </strong>: {points.points}
              </li>
              {points.honor > 0 && (
                <li className="text-center">
                  <strong>Honor </strong>: {points.honor}
                </li>
              )}
            </ul>
          </div>

          <div className="p-3 bg-light border-top">
            <ul className="list-unstyled d-flex justify-content-between">
              {_.map(playedCards, (card, idx) => {
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
          </div>
          <div className="p-3 border-top ">
            <div className="form-group form-check text-muted mb-0">
              <input
                type="checkbox"
                className="form-check-input"
                id="continueAutomatically"
                checked={continueAutomatically}
                onChange={() =>
                  setContinueAutomatically(!continueAutomatically)
                }
              />
              <label
                className="form-check-label"
                htmlFor="continueAutomatically"
              >
                Continue next trick automatically
              </label>
            </div>
          </div>
        </div>
        <button
          className="m-0 btn btn-sm btn-text text-primary btn-block bg-light p-3 px-3"
          onClick={() => moves.ContinueToNextTrick(continueAutomatically)}
        >
          Continue
        </button>
      </div>
    </>
  );
};

export default ShowResultsOfTrick;
