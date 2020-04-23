import React from 'react';
import _ from 'lodash';
import { faTree } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { determineBid } from 'GameLogic/Phases/PlaceBids';
import { Bid } from 'App/ShowResultOfHand';

const TeamPoints = ({ round, points }) => {
  if (round.pit && points !== 0) {
    const honor = round.playedTricks.reduce(
      (total, { honor }) => total + honor,
      0
    );

    if (honor === 0) {
      return <strong>Pit</strong>;
    }

    return (
      <span>
        <strong>Pit</strong>
        <span> (+{honor})</span>
      </span>
    );
  }
  if (round.wet && points === 0) {
    return <em>Wet</em>;
  }
  return <span>{points}</span>;
};

const TreeTable = ({ rounds }) => {
  return (
    <table className="table mb-0 border-bottom">
      <thead>
        <tr className="bg-light">
          <th>
            <FontAwesomeIcon icon={faTree} className="text-dark mr-2" />
            Round
          </th>
          <th colSpan="2" className="text-center">
            Wij{' '}
          </th>
          <th colSpan="2" className="text-center">
            Zij
          </th>
        </tr>
      </thead>
      <tbody>
        {rounds.map((round, idx) => {
          const { wij, zij, bids, wet, pit } = round;

          // TODO: replace with round.bid ?
          const { highestBidBy, bid, trump } = determineBid({ bids });

          return (
            <tr key={idx}>
              <td className="text-muted">{idx + 1}</td>
              <td className="text-right">
                {[0, 2].includes(highestBidBy) && <Bid bid={{ bid, trump }} />}
              </td>
              <td className="text-left">
                <TeamPoints round={round} points={wij} />
              </td>
              <td className="text-right">
                <TeamPoints round={round} points={zij} />
              </td>
              <td className="text-left">
                {[1, 3].includes(highestBidBy) && <Bid bid={{ bid, trump }} />}
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <th>Total</th>
          <td colSpan="2" className="text-center font-weight-bold">
            {_(rounds)
              .map(({ wij }) => wij)
              .sum()}
          </td>
          <td colSpan="2" className="text-center font-weight-bold">
            {_(rounds)
              .map(({ zij }) => zij)
              .sum()}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default TreeTable;
