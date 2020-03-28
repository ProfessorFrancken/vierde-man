import React from 'react';
import { Bid } from 'App/PlaceBid';
import { CurrentPlayedCards } from 'App/PlayTrick';
import { CurrentBids } from 'App/PlaceBid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';

const Header = ({ game, phase, currentBids, currentPlayer }) => {
  return (
    <div className="w-100 bg-primary">
      <div className="d-flex justify-content-between align-items-center text-white p-3">
        <div>
          {game.bid.trump !== undefined ? (
            <Bid bid={{ bid: game.bid.bid, suit: game.bid.trump }} />
          ) : (
            <span>Select a bid</span>
          )}
        </div>
        <div className="d-flex justify-content-between">
          <ul className="list-unstyled mb-0 d-flex -justify-content-between ">
            <li className="bg-dark text-white px-3 py-1 rounded mx-2">
              <strong>Wij</strong>: {game.wij}
            </li>
            <li className="bg-dark text-white px-3 py-1 rounded mx-2">
              <strong>Zij</strong>: {game.zij}
            </li>
            <li className="bg-dark text-white px-3 py-1 rounded">
              <FontAwesomeIcon icon={faFileAlt} />
            </li>
          </ul>
          {/* <div> */}
          {/*   Wij: {game.wij} | Zij: {game.zij} */}
          {/*   {/\* Wij: {G.rounds.filter(({ winner }) => [0, 2].includes(winner)).map(({ points })} | Zij: {G.zij} *\/} */}
          {/* </div> */}
        </div>
      </div>
      {phase === 'PlaceBids' && (
        <CurrentBids bids={currentBids} currentPlayer={currentPlayer} />
      )}
      {phase === 'PlayTricks' && (
        <CurrentPlayedCards
          currentTrick={game.currentTrick}
          currentPlayer={currentPlayer}
        />
      )}
    </div>
  );
};

export default Header;
