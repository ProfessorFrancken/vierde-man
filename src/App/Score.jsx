import React from 'react';
import { Bid } from 'App/PlaceBid';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';

const ScoreContainer = styled.div`
  grid-area: s;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Score = ({ game }) => {
  return (
    <ScoreContainer>
      <div className="p-3 bg-light shadow rounded text-left text-muted d-flex flex-column">
        <div className="font-weight-bold mb-2">
          Round {game.rounds.length + 1} / 16
        </div>
        <table style={{ fontSize: '0.8rem' }} className="d-none">
          <thead>
            <tr>
              <th colspan="2" className="text-right">
                Wij
              </th>
              <th colspan="2" className="text-left">
                Zij
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                (
                {game.bid.trump !== undefined &&
                  [0, 2].includes(game.bid.highestBidBy) && (
                    <Bid bid={{ bid: game.bid.bid, suit: game.bid.trump }} />
                  )}
                )
              </td>
              <td className="text-right">{game.wij}</td>
              <td className="text-left">{game.zij}</td>
              <td>
                (
                {game.bid.trump !== undefined &&
                  [1, 3].includes(game.bid.highestBidBy) && (
                    <Bid bid={{ bid: game.bid.bid, suit: game.bid.trump }} />
                  )}
                )
              </td>
            </tr>
            <tr>
              <td colspan="2" className="text-right">
                {game.wij}
              </td>
              <td colspan="2" className="text-left">
                {game.zij}
              </td>
            </tr>
          </tbody>
        </table>
        <ul
          className="list-unstyled ml-0 mb-0 d-flex justify-content-center"
          style={{ fontSize: '0.8rem' }}
        >
          <li className="text-muted p-1 d-flex flex-column text-right align-items-end">
            <strong>Wij</strong>
            <div className="d-flex justify-content-between">
              <div className="mr-2 d-none">
                {game.bid.trump !== undefined &&
                  [0, 2].includes(game.bid.highestBidBy) && (
                    <Bid bid={{ bid: game.bid.bid, suit: game.bid.trump }} />
                  )}
              </div>
              <span>{game.wij}</span>
            </div>
            <span>{game.wij}</span>
          </li>
          <li className="text-muted p-1 mx-2 d-flex flex-column text-left align-items-start">
            <strong>Zij</strong>
            <div className="d-flex justify-content-between">
              <span>{game.zij}</span>
              <div className="ml-2 d-none">
                {game.bid.trump !== undefined &&
                  [1, 3].includes(game.bid.highestBidBy) && (
                    <Bid bid={{ bid: game.bid.bid, suit: game.bid.trump }} />
                  )}
              </div>
            </div>
            <span>{game.zij}</span>
          </li>
          <li>
            {game.bid.trump !== undefined &&
              [0, 2].includes(game.bid.highestBidBy) && (
                <Bid bid={{ bid: game.bid.bid, suit: game.bid.trump }} />
              )}
          </li>
        </ul>
        <div className="text-muted py-1 rounded d-none">
          <button className="btn btn-text text-muted px-0">
            <FontAwesomeIcon
              icon={faFileAlt}
              fixedWidth
              className="text-muted"
            />
            view score
          </button>
        </div>
      </div>
    </ScoreContainer>
  );
};

export default Score;
