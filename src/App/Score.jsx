import React from 'react';
import { Bid } from 'App/PlaceBid';
import styled from 'styled-components';
import _ from 'lodash';

const Prominent = ({ children }) => (
  <span>{children === 33 ? "'Vo" : children}</span>
);

const ScoreContainer = styled.div`
  grid-area: s;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  z-index: var(--score-z-index);
`;

const Score = ({ rounds, playedTricks, wij, zij, bid }) => {
  const currentTricks = playedTricks;
  const tricksByWij = _(currentTricks)
    .filter(({ winner }) => [0, 2].includes(winner))
    .map(({ points, honor }) => points + honor)
    .sum();
  const tricksByZij = _(currentTricks)
    .filter(({ winner }) => [1, 3].includes(winner))
    .map(({ points, honor }) => points + honor)
    .sum();

  return (
    <ScoreContainer>
      <div className="m-3 m-md-4 m-lg-5 p-3 bg-light shadow rounded text-left text-muted d-flex flex-column">
        <div className="font-weight-bold mb-2">
          Round {rounds.length + 1} / 16
        </div>
        <ul
          className="list-unstyled ml-0 mb-0 d-flex justify-content-center"
          style={{ fontSize: '0.8rem' }}
        >
          <li className="text-muted p-1 d-flex flex-column text-right align-items-end">
            <strong>Wij</strong>
            <div className="d-flex justify-content-between">
              <div className="mr-2">
                {bid.trump !== undefined &&
                  [0, 2].includes(bid.highestBidBy) && (
                    <Bid bid={{ bid: bid.bid, suit: bid.trump }} />
                  )}
              </div>
              <Prominent>{tricksByWij}</Prominent>
            </div>
            <Prominent>{wij}</Prominent>
          </li>
          <li className="text-muted p-1 mx-2 d-flex flex-column text-left align-items-start">
            <strong>Zij</strong>
            <div className="d-flex justify-content-between">
              <Prominent>{tricksByZij}</Prominent>
              <div className="ml-2">
                {bid.trump !== undefined &&
                  [1, 3].includes(bid.highestBidBy) && (
                    <Bid bid={{ bid: bid.bid, suit: bid.trump }} />
                  )}
              </div>
            </div>
            <Prominent>{zij}</Prominent>
          </li>
        </ul>
      </div>
    </ScoreContainer>
  );
};

export default Score;
