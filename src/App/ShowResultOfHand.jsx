import React, { useState, useEffect } from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import Card from 'Components/Card';
import { WinnerOfTrick, PointsOfTrick } from 'GameLogic/Card';
import _ from 'lodash';
import styled, { css } from 'styled-components';

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
      <SuitStringToComponent suit={bid.trump} />
    </span>
  );
};

const ShowResultsOfHand = ({
  game,
  moves,
  continueNextTrick,
  currentTrick: { playedCards, startingPlayer },
  trump,
  currentPlayer,
  continueTrickAutomatically = {}
}) => {
  const [continueAutomatically, setContinueAutomatically] = useState(
    continueTrickAutomatically[currentPlayer] === true
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (continueTrickAutomatically[currentPlayer]) {
        moves.PlayNextHand(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPlayer, continueTrickAutomatically, moves]);

  const round = game.rounds[game.rounds.length - 1];
  const [tricksByWij, tricksByZij] = _.partition(
    round.playedTricks,
    ({ winner }) => [0, 2].includes(winner)
  );
  console.log({ tricksByWij, tricksByZij });

  const lastTrick = round.playedTricks[round.playedTricks.length - 1];

  return (
    <>
      <div className="bg-white rounded shadow text-left" style={{ zIndex: 10 }}>
        <div className="">
          <div className="p-3">
            <h3 className="h5">Finished hand</h3>
          </div>
          <table className="table mb-0">
            <thead>
              <tr>
                <th></th>
                <th>Wij</th>
                <th>Zij</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Points</td>
                <td>
                  {_(tricksByWij)
                    .map(({ points }) => points)
                    .sum()}
                </td>
                <td>
                  {_(tricksByZij)
                    .map(({ points }) => points)
                    .sum()}
                </td>
              </tr>
              <tr>
                <td>Honor</td>
                <td>
                  {_(tricksByWij)
                    .map(({ honor }) => honor)
                    .sum()}
                </td>
                <td>
                  {_(tricksByZij)
                    .map(({ honor }) => honor)
                    .sum()}
                </td>
              </tr>
              <tr>
                <td>Last trick</td>
                <td>
                  <span>{[0, 2].includes(lastTrick.winner) ? '10' : '0'}</span>
                </td>
                <td>
                  <span>{[1, 3].includes(lastTrick.winner) ? '10' : '0'}</span>
                </td>
              </tr>
              <tr>
                <td>Bid</td>
                <td>
                  {[0, 2].includes(game.bid.highestBidBy) && (
                    <Bid bid={game.bid} />
                  )}
                </td>
                <td>
                  {[1, 3].includes(game.bid.highestBidBy) && (
                    <Bid bid={game.bid} />
                  )}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                <td>{round.wij}</td>
                <td>{round.zij}</td>
              </tr>
            </tfoot>
          </table>
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
          onClick={() => moves.PlayNextHand(continueAutomatically)}
        >
          Play next hand
        </button>
      </div>
    </>
  );
};

export default ShowResultsOfHand;
