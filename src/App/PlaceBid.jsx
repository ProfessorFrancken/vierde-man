import React, { useState } from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import { SUITES, SANS } from 'GameLogic/Card';
import { canPlaceBid } from 'GameLogic/Phases/PlaceBids';
import { Spades, Hearts, Diamonds, Clubs, Sans } from 'Components/SuitIcon';
import _ from 'lodash';

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

const PlaceBid = ({ placeBid, pass, currentBids, currentPlayer }) => {
  const [trump, setTrump] = useState(CLUBS);
  const [bid, setBid] = useState(80);

  const isSans = trump === SANS;
  const trumpOptions = [SANS, SPADES, HEARTS, CLUBS, DIAMONDS];
  const trumpLabel = {
    [SANS]: 'Sans',
    [SPADES]: '♠ Spades',
    [HEARTS]: '♥ Hearts',
    [CLUBS]: '♣ Clubs',
    [DIAMONDS]: '♦ Diamonds'
  };

  const allowedBids = (isSans
    ? [70, 80, 90, 100, 110, 120, 130, 'pit']
    : [80, 90, 100, 110, 120, 130, 140, 150, 160, 'pit']
  ).filter(bid => canPlaceBid(currentBids, { bid, suit: trump }));

  const bidCanBePlaced = ({ bid, trump }) =>
    canPlaceBid(currentBids, { bid, suit: trump });

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

  const trumpOptionss = [
    { trump: SPADES, component: <Spades /> },
    { trump: HEARTS, component: <Hearts /> },
    { trump: CLUBS, component: <Clubs /> },
    { trump: DIAMONDS, component: <Diamonds /> },
    { trump: SANS, component: <Sans /> }
  ];
  const redColor = '#e44145';
  const blackColor = '#252525';
  const isRed = suit => [HEARTS, DIAMONDS].includes(suit);

  const bidsToShow = _.take([...currentBids].reverse(), 3);
  console.log(bidsToShow);
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
                  {bid.bidBy === currentPlayer ? (
                    <span>Placing bid</span>
                  ) : (
                    <Bid bid={bid} />
                  )}
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
            <label for="">Trump</label>
            <select
              className="form-control form-control-sm"
              style={{ color: isRed(trump) ? redColor : blackColor }}
              id="trump"
              onChange={changeTrump}
              value={trump}
            >
              {trumpOptions.map(trump => (
                <option
                  key={trump}
                  value={trump}
                  style={{ color: isRed(trump) ? redColor : blackColor }}
                >
                  {trumpLabel[trump]}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group flex-grow-1 ml-2">
            <label for="">Bid</label>
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
            className="m-0 btn btn-sm btn-text text-muted btn-block bg-light p-3 px-3 "
            type="submit"
            onClick={() => {
              const result = pass();
              console.log({ result });
              return;
            }}
          >
            Pass
          </button>
          <button
            className="m-0 btn btn-sm btn-text text-primary btn-block bg-light p-3 px-3"
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
      </div>
    </div>
  );
};

export default PlaceBid;
