import React, { useState } from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import { SUITES, SANS } from 'GameLogic/Card';
import { canPlaceBid } from 'GameLogic/Phases/PlaceBids';
import { WinnerOfTrick } from 'GameLogic/Card';
import PlayedCards from 'App/PlayedCards';
import { PlayerToStartCurrentTrick } from 'GameLogic/Phases/PlayTricks';
import _ from 'lodash';

const { SPADES, HEARTS, CLUBS, DIAMONDS } = SUITES;

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

const ShowResultsOfTrick = ({ game, moves, continueNextTrick, playerId }) => {
  return (
    <>
      <div className="bg-white rounded shadow text-left" style={{ zIndex: 10 }}>
        <div className="">
          <div className="p-3">
            <h3 className="h5">
              Player{' '}
              {WinnerOfTrick(
                game.currentTrick.playedCards,
                game.currentTrick.playedCards[game.currentTrick.startingPlayer],
                game.bid.trump
              )}{' '}
              won the trick
            </h3>
          </div>
          <div className="p-3 border-top ">
            <div className="form-group form-check text-muted mb-0">
              <input
                type="checkbox"
                className="form-check-input"
                id="continueAutomatically"
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
          onClick={() => moves.ContinueToNextTrick()}
        >
          Continue
        </button>
      </div>
      <PlayedCards
        cards={game.currentTrick.playedCards}
        startingPlayer={PlayerToStartCurrentTrick(game, {
          numPlayers: 4
        })}
        playerId={playerId}
      />
    </>
  );

  const honor = [];

  return (
    <div
      className="d-flex flex-column w-50 text-left bg-white mx-auto shadow border my-3"
      style={{ fontSize: '0.7rem', zIndex: '2' }}
    >
      <div className="p-3">
        <h3 className="h5">Trick results</h3>
      </div>
      {honor.length > 0 && (
        <div className="p-3 bg-light border-top">
          <h4 className="h6">Honor gained</h4>
          <ul className="list-unstyled text-muted my-2">
            {honor.map((honor, idx) => (
              <li className="d-flex justify-content-between my-2" key={idx}>
                <div>
                  <strong>Check</strong>:
                </div>
                <div>Honor {honor}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="bg-white">
        <div className="d-flex justify-content-between ">
          <button
            className="m-0 btn btn-sm btn-text text-muted btn-block bg-light p-3 px-3 "
            type="submit"
            onClick={continueNextTrick}
          >
            Continue next trick
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowResultsOfTrick;
