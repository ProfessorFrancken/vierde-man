import React, { useState } from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import { SUITES, SANS } from 'GameLogic/Card';
import { allowedBidsOnTrump } from 'GameLogic/Phases/PlaceBids';
import Modal from 'Components/Modal';
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
    [SANS]: 'var(--black-suit-color)',
    [SPADES]: 'var(--black-suit-color)',
    [HEARTS]: 'var(--red-suit-color)',
    [CLUBS]: 'var(--black-suit-color)',
    [DIAMONDS]: 'var(--red-suit-color)',
    APRIL: '#8f8500'
  };

  const allowedBids = allowedBidsOnTrump(currentBids, trump);

  if (!allowedBids.includes(bid)) {
    if (allowedBids.length === 0) {
      if (trump === SANS) {
        // Can't bid any higher, so let's revert to a non SANS bid
        setTrump(CLUBS);
      }
    } else {
      setBid(allowedBids[0]);
    }
  }

  const changeTrump = e => {
    setTrump(e.target.value);
  };

  const changeBid = e => {
    setBid(parseInt(e.target.value, 10));
  };

  const bidsToShow = _.take([...currentBids].reverse(), 3);

  return (
    <Modal.Dialog className="">
      <Modal.Header>
        <Modal.Title>Bidding round</Modal.Title>
      </Modal.Header>
      {bidsToShow.length > 0 && (
        <Modal.Body className="bg-light border-top">
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
        </Modal.Body>
      )}
      <Modal.Body className="bg-white border-top">
        <h4 className="h6">Place bid</h4>

        <div className="d-flex justify-content-between flex-md-row flex-column">
          <div className="form-group flex-grow-1 mr-md-2">
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
          <div className="form-group flex-grow-1 ml-md-2">
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
      </Modal.Body>
      <Modal.Footer>
        {!active && (
          <Modal.Body>
            Waiting for player {currentPlayer} to place a bid
          </Modal.Body>
        )}
        {active && (
          <Modal.Actions>
            <Modal.Action className="text-muted" onClick={() => pass()}>
              Pass
            </Modal.Action>
            {allowedBids.length > 0 && (
              <Modal.Action
                className="text-primary"
                onClick={() => placeBid({ suit: trump, bid })}
              >
                Submit bid
              </Modal.Action>
            )}
          </Modal.Actions>
        )}
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default PlaceBid;
