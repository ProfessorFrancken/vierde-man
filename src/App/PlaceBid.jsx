import React, { useState } from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import { SUITES, SANS } from 'GameLogic/Card';
import { canPlaceBid } from 'GameLogic/Phases/PlaceBids';
const { SPADES, HEARTS, CLUBS, DIAMONDS } = SUITES;

export const CurrentBids = ({ bids, currentPlayer }) => {
  return (
    <ul
      className="list-unstyled mb-0 d-flex justify-content-between"
      style={{ fontSize: '0.75rem' }}
    >
      {[0, 1, 2, 3].map(id => (
        <li className="bg-white shadow-sm p-3 w-25" key={id}>
          <strong>Player {id}</strong>:<br />
          {id === currentPlayer ? (
            <span>Placing bid</span>
          ) : (
            <Bid bid={bids[id]} />
          )}
        </li>
      ))}
    </ul>
  );
};

export const Bid = ({ bid }) => {
  if (bid === undefined) {
    return <span>Waiting for bid...</span>;
  }

  if (bid === null) {
    return <span>Pass</span>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-1">
      <strong className="mr-2">{bid.bid}</strong>
      <SuitStringToComponent suit={bid.suit} />
    </div>
  );
};

const PlaceBid = ({ placeBid, pass, currentBids, currentPlayer }) => {
  const [trump, setTrump] = useState(CLUBS);
  const [bid, setBid] = useState(80);

  console.log(currentBids);

  const isSans = trump === SANS;
  const trumpOptions = [SANS, SPADES, HEARTS, CLUBS, DIAMONDS];
  const trumpLabel = {
    [SANS]: 'Sans',
    [SPADES]: 'Spades',
    [HEARTS]: 'Hearts',
    [CLUBS]: 'Clubs',
    [DIAMONDS]: 'Diamonds'
  };

  const allowedBids = (isSans
    ? [70, 80, 90, 100, 110, 120, 130, 'pit']
    : [80, 90, 100, 110, 120, 130, 140, 150, 160, 'pit']
  ).filter(bid => canPlaceBid(currentBids, { bid, suit: trump }));

  if (!allowedBids.includes(bid)) {
    setBid(allowedBids[0]);
  }

  const changeTrump = e => {
    console.log('Changing trump', e);
    setTrump(e.target.value);
  };

  const changeBid = e => {
    console.log('Changing bid', e);
    setBid(parseInt(e.target.value, 10));
  };

  return (
    <div className="d-flex flex-column w-100 text-left">
      <h4>Place a bid</h4>
      <div className="d-flex justify-content-between">
        <div className="form-group">
          <select
            className="form-control form-control-sm"
            id="trump"
            onChange={changeTrump}
            value={trump}
          >
            {trumpOptions.map(trump => (
              <option key={trump} value={trump}>
                {trumpLabel[trump]}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <select
            className="form-control form-control-sm"
            id="bid"
            onChange={changeBid}
            value={bid}
          >
            {allowedBids.map(bid => (
              <option key={bid} value={bid}>
                {bid}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            className="btn btn-primary"
            type="submit"
            onClick={() => {
              const result = placeBid({ suit: trump, bid });
              console.log({ result, suit: trump, bid });
              return;
            }}
          >
            Submit bid
          </button>
        </div>
        <div>
          <button
            className="btn btn-primary"
            type="submit"
            onClick={() => {
              const result = pass();
              console.log({ result });
              return;
            }}
          >
            Pass
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-between"></div>
    </div>
  );
};

export default PlaceBid;
