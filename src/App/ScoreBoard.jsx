import React from 'react';
import { SuitStringToComponent } from 'Components/Suits';

const Notes = G => {
  const Bid = ({ bid }) => {
    if (!bid) {
      return 'No known bid';
    }
    return (
      <div>
        <h3>
          Bid by:
          <small>{bid.highestBidBy}</small>
          <small>
            {bid.bid}
            <SuitStringToComponent suit={bid.trump} />
          </small>
        </h3>
      </div>
    );
  };
  const Boompje = () => (
    <div>
      <h3>Boompje</h3>
      <h4>Tak 1</h4>
      <h4>Tak 2</h4>
      <h4>Tak 3</h4>
      <h4>Tak 4</h4>
    </div>
  );
  const CurrentTrick = ({ currentTrick }) => {
    return (
      <div className="flex-grow-1 w-100">
        <ul className="list-unstyled">
          <li>
            <h4>Starting player</h4>
            {currentTrick.startingPlayer}
          </li>
          <li>
            <h4>Played cards</h4>
            <ul className="list-unstyled d-flex justify-content-between">
              {[0, 1, 2, 3].map(id => (
                <li className="bg-light p-4 m-3" key={id}>
                  Player {id}:
                  {currentTrick.playedCards[id] === undefined ? (
                    'Waiting'
                  ) : (
                    <div>
                      {currentTrick.playedCards[id].face}
                      <SuitStringToComponent
                        suit={currentTrick.playedCards[id].suit}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    );
  };

  const CurrentHand = G => {
    return (
      <ul className="list-unstyled">
        <li>
          <CurrentTrick {...G} />
        </li>
        {G.playedTricks.map(trick => {
          return (
            <li>
              <p> winner: {trick.winner} </p>
              <p> points: {trick.points} </p>
              <p> honor: {trick.honor} </p>
              <p>
                {' '}
                cards:
                <ul className="list-unstyled d-flex justify-content-between">
                  {[0, 1, 2, 3].map(id => (
                    <li className="bg-light p-4 m-3">
                      {trick.cards[id].face}
                      <SuitStringToComponent suit={trick.cards[id].suit} />
                    </li>
                  ))}
                </ul>
              </p>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div>
      <Bid {...G} />
      <CurrentHand {...G} />
      <Boompje {...G} />
    </div>
  );
};

export default Notes;
