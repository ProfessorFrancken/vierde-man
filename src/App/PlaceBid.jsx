import React, { useState } from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import { SUITES, SANS } from 'GameLogic/Card';
import { allowedBidsOnTrump } from 'GameLogic/Phases/PlaceBids';
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

const PlaceBid = ({ placeBid, pass, currentBids, currentPlayer, active }) => {
  const [trump, setTrump] = useState(CLUBS);
  const [bid, setBid] = useState(80);

  const trumpOptions = [SANS, SPADES, HEARTS, CLUBS, DIAMONDS];
  const trumpLabel = {
    [SANS]: 'Sans',
    [SPADES]: '♠ Spades',
    [HEARTS]: '♥ Hearts',
    [CLUBS]: '♣ Clubs',
    [DIAMONDS]: '♦ Diamonds'
  };
  const suitColor = {
    [SANS]: '#252525',
    [SPADES]: '#252525',
    [HEARTS]: '#e44145',
    [CLUBS]: '#252525',
    [DIAMONDS]: '#e44145',
    APRIL: '#8f8500'
  };

  const allowedBids = allowedBidsOnTrump(currentBids, trump);

  if (!allowedBids.includes(bid)) {
    setBid(allowedBids[0]);
  }

  const changeTrump = e => {
    setTrump(e.target.value);
  };

  const changeBid = e => {
    setBid(parseInt(e.target.value, 10));
  };

  const bidsToShow = _.take([...currentBids].reverse(), 3);

  return (
    <div
      className="d-flex flex-column w-50 text-left bg-white mx-auto shadow border my-3"
      style={{ fontSize: '0.7rem', zIndex: '2' }}
    >
      <div className="p-3">
        <h3 className="h5">Bidding round</h3>
      </div>
      {bidsToShow.length > 0 && (
        <div className="p-3 bg-light border-top">
          <h4 className="h6">Previous bids</h4>
          <ul className="list-unstyled text-muted my-2">
            {bidsToShow.map((bid, idx) => (
              <li className="d-flex justify-content-between my-2" key={idx}>
                <div>
                  <strong>Player {bid.bidBy}</strong>:
                </div>
                <div>
                  <Bid bid={bid} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="bg-white border-top p-3">
        <h4 className="h6">Place bid</h4>

        <div className="d-flex  justify-content-between">
          <div className="form-group flex-grow-1 mr-2">
            <label htmlFor="">Trump</label>
            <select
              className="form-control form-control-sm"
              style={{ color: suitColor[trump] }}
              id="trump"
              onChange={changeTrump}
              value={trump}
            >
              {trumpOptions.map(trump => (
                <option
                  key={trump}
                  value={trump}
                  style={{ color: suitColor[trump] }}
                >
                  {trumpLabel[trump]}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group flex-grow-1 ml-2">
            <label htmlFor="">Bid</label>
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
        </div>
      </div>
      <div className="bg-white">
        <div className="d-flex justify-content-between ">
          <button
            disabled={!active}
            className="m-0 btn btn-sm btn-text text-muted btn-block bg-light p-3 px-3 "
            type="submit"
            onClick={() => {
              if (!active) {
                return;
              }
              pass();
            }}
          >
            Pass
          </button>
          <button
            disabled={!active}
            className="m-0 btn btn-sm btn-text text-primary btn-block bg-light p-3 px-3"
            type="submit"
            onClick={() => {
              if (!active) {
                return;
              }
              placeBid({ suit: trump, bid });
            }}
          >
            Submit bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceBid;
