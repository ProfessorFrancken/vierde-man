import React from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import _ from 'lodash';
import Modal from 'Components/Modal';
import { useSpring, animated } from 'react-spring';

const Prominent = ({ children }) => (
  <span>{children === 33 ? "'Vo" : children}</span>
);

const Wet = ({ round, points, children }) =>
  round.wet && points === 0 ? <span>Wet</span> : children;
const Pit = ({ round, points, children }) =>
  round.pit && points !== 0 ? <strong>Pit</strong> : children;
const Points = ({ round, points }) => (
  <Wet round={round} points={points}>
    <Pit round={round} points={points}>
      <Prominent>{points}</Prominent>
    </Pit>
  </Wet>
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

const ResultTable = ({ round, bid, wij, zij }) => {
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
          <th className="text-left">Wij</th>
          <th className="text-left">Zij</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="text-right">Points</td>
          <td className="text-left">
            <Prominent>
              {_(tricksByWij)
                .map(({ points }) => points)
                .sum() + ([0, 2].includes(lastTrick.winner) ? 10 : 0)}
            </Prominent>
          </td>
          <td className="text-left">
            <Prominent>
              {_(tricksByZij)
                .map(({ points }) => points)
                .sum() + ([1, 3].includes(lastTrick.winner) ? 10 : 0)}
            </Prominent>
          </td>
        </tr>
        <tr>
          <td className="text-right">Honor</td>
          <td className="text-left">
            <Prominent>
              {_(tricksByWij)
                .map(({ honor }) => honor)
                .sum()}
            </Prominent>
          </td>
          <td className="text-left">
            <Prominent>
              {_(tricksByZij)
                .map(({ honor }) => honor)
                .sum()}
            </Prominent>
          </td>
        </tr>
        <tr>
          <td className="text-right">Bid</td>
          <td className="text-left">
            {[0, 2].includes(bid.highestBidBy) && <Bid bid={bid} />}
          </td>
          <td className="text-left">
            {[1, 3].includes(bid.highestBidBy) && <Bid bid={bid} />}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th className="text-right">This round</th>
          <td className="text-left">
            <Points round={round} points={round.wij} />
          </td>
          <td className="text-left">
            <Points round={round} points={round.zij} />
          </td>
        </tr>
        <tr>
          <th className="text-right">Total</th>
          <td className="text-left">
            <Prominent>{wij}</Prominent>
          </td>
          <td className="text-left">
            <Prominent>{zij}</Prominent>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

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
  const springProps = useSpring({
    width: '100%',
    from: { width: '0%' },
    delay: 1000,
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
        <Modal.Title className="mb-0 text-center">Finished hand</Modal.Title>
        <div className="mt-2 text-center text-muted">
          {game.rounds.length} / 16
        </div>
      </Modal.Header>
      <Modal.Table className="border-bottom">
        <ResultTable
          round={round}
          bid={game.bid}
          wij={game.wij}
          zij={game.zij}
        />
      </Modal.Table>
      <Modal.Footer className="border-0">
        {playersThatWantToPlayNextHand.includes(playerId) ? (
          <Modal.Body className="p-3 text-center">
            Waiting for other players
          </Modal.Body>
        ) : (
          <Modal.Actions>
            <Modal.Action
              primary
              onClick={() => moves.PlayNextHand(playerId, true)}
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
          ></animated.div>
        </div>
      )}
    </Modal.Dialog>
  );
};

export default ShowResultsOfHand;
