import React, { useState, useEffect } from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import _ from 'lodash';
import Modal from 'Components/Modal';
import { useSpring, animated } from 'react-spring';

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
                .sum() + [0, 2].includes(lastTrick.winner)
                ? 10
                : 0}
            </Prominent>
          </td>
          <td>
            <Prominent>
              {_(tricksByZij)
                .map(({ points }) => points)
                .sum() + [1, 3].includes(lastTrick.winner)
                ? 10
                : 0}
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
  playerId,
  continueTrickAutomatically = {},
  playersThatWantToPlayNextHand = [],
}) => {
  const [continueAutomatically, setContinueAutomatically] = useState(
    continueTrickAutomatically[playerId] === true
  );
  const springProps = useSpring({
    width: '100%',
    from: { width: '0%' },
    delay: 2500,
    config: { duration: 5000 },
    onRest: () => {
      if (!playersThatWantToPlayNextHand.includes(playerId)) {
        moves.PlayNextHand(playerId, true);
      }
    },
  });

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
      <Modal.Footer className="border-0">
        {playersThatWantToPlayNextHand.includes(playerId) ? (
          <Modal.Body className="p-4">Waiting for other players</Modal.Body>
        ) : (
          <Modal.Actions>
            <Modal.Action
              primary
              onClick={() =>
                moves.PlayNextHand(playerId, continueAutomatically)
              }
            >
              Play next hand
            </Modal.Action>
          </Modal.Actions>
        )}
      </Modal.Footer>
      {!playersThatWantToPlayNextHand.includes(playerId) && (
        <div
          className="progress"
          style={{ borderRadius: '0', height: '0.5rem' }}
        >
          <animated.div
            className="bg-primary"
            role="progressbar"
            style={springProps}
            aria-valuenow={springProps.width}
            aria-valuemin="0%"
            aria-valuemax="100%"
          ></animated.div>
        </div>
      )}
    </Modal.Dialog>
  );
};

export default ShowResultsOfHand;
