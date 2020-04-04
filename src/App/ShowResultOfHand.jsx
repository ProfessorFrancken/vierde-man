import React, { useState, useEffect } from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import _ from 'lodash';
import Modal from 'Components/Modal';

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

const ResultTable = ({ round, bid }) => {
  const [tricksByWij, tricksByZij] = _.partition(
    round.playedTricks,
    ({ winner }) => [0, 2].includes(winner)
  );

  const lastTrick = round.playedTricks[round.playedTricks.length - 1];

  return (
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
            <Prominent>
              {_(tricksByWij)
                .map(({ points }) => points)
                .sum()}
            </Prominent>
          </td>
          <td>
            <Prominent>
              {_(tricksByZij)
                .map(({ points }) => points)
                .sum()}
            </Prominent>
          </td>
        </tr>
        <tr>
          <td>Honor</td>
          <td>
            <Prominent>
              {_(tricksByWij)
                .map(({ honor }) => honor)
                .sum()}
            </Prominent>
          </td>
          <td>
            <Prominent>
              {_(tricksByZij)
                .map(({ honor }) => honor)
                .sum()}
            </Prominent>
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
          <td>{[0, 2].includes(bid.highestBidBy) && <Bid bid={bid} />}</td>
          <td>{[1, 3].includes(bid.highestBidBy) && <Bid bid={bid} />}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>Total</th>
          <td>
            <Prominent>{round.wij}</Prominent>
          </td>
          <td>
            <Prominent>{round.zij}</Prominent>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

const CheckContinueAutomatically = ({ checked, onChange }) => (
  <div className="form-group form-check text-muted mb-0">
    <input
      type="checkbox"
      className="form-check-input"
      id="continueAutomatically"
      checked={checked}
      onChange={onChange}
    />
    <label className="form-check-label" htmlFor="continueAutomatically">
      Continue next trick automatically
    </label>
  </div>
);

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

  return (
    <Modal.Dialog style={{ zIndex: 'var(--modal-z-index)' }}>
      <Modal.Header>
        <Modal.Title>Finished hand</Modal.Title>
      </Modal.Header>
      <Modal.Table>
        <ResultTable round={round} bid={game.bid} />
      </Modal.Table>
      <Modal.Body className="border-top">
        <CheckContinueAutomatically
          checked={continueAutomatically}
          onChange={() => setContinueAutomatically(!continueAutomatically)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Modal.Actions>
          <Modal.Action
            onClick={() => moves.PlayNextHand(continueAutomatically)}
          >
            Play next hand
          </Modal.Action>
        </Modal.Actions>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default ShowResultsOfHand;
