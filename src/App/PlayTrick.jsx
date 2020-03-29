import React from 'react';
import { SuitStringToComponent } from 'Components/Suits';

export const CurrentPlayedCards = ({ currentTrick, currentPlayer }) => {
  return (
    <ul
      className="list-unstyled mb-0 d-flex justify-content-between"
      style={{ fontSize: '0.75rem' }}
    >
      {[0, 1, 2, 3].map(id => (
        /* TODO: when waiting make gray and text-muted */
        /*              when currently playing add border primary */

        <li className="bg-white shadow-sm p-3 w-25">
          <strong>Player {id}</strong>:<br />
          {id === currentPlayer ? (
            <span>Choosing card</span>
          ) : (
            <Card card={currentTrick.playedCards[id]} />
          )}
        </li>
      ))}
    </ul>
  );
};

export const Card = ({ card }) => {
  if (card === undefined) {
    return <span>Waiting for turn...</span>;
  }
  return (
    <div class="d-flex justify-content-center align-items-center mt-1">
      <strong className="mr-2">{card.face}</strong>
      <SuitStringToComponent suit={card.suit} />
    </div>
  );
};
