import React from 'react';
import _ from 'lodash';
import { faTree } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TeamPoints = ({ wet, points }) => (
  <td className="text-right">{wet && points === 0 ? <em>Wet</em> : points}</td>
);

const TreeTable = ({ rounds }) => {
  return (
    <table className="table mb-0 border-bottom">
      <thead>
        <tr className="bg-light">
          <th>
            <FontAwesomeIcon icon={faTree} className="text-dark mr-2" />
            Round
          </th>
          <th className="text-right">Wij </th>
          <th className="text-right">Zij</th>
        </tr>
      </thead>
      <tbody>
        {rounds.map((round, idx) => {
          const { wij, zij, wet } = round;

          return (
            <tr key={idx}>
              <td className="text-muted">{idx + 1}</td>
              <TeamPoints wet={wet} points={wij} />
              <TeamPoints wet={wet} points={zij} />
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <th>Total</th>
          <td className="text-right font-weight-bold">
            {_(rounds)
              .map(({ wij }) => wij)
              .sum()}
          </td>
          <td className="text-right font-weight-bold">
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
