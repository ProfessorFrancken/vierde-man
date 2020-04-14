import React from 'react';
import PlaceBid from 'App/PlaceBid';
import styled, { css } from 'styled-components';
import PlayerHand from 'Components/PlayerHand';
import ShowResultsOfTrick from 'App/ShowResultsOfTrick';
import ShowResultsOfHand from 'App/ShowResultOfHand';
import PlayedCards from 'App/PlayedCards';
import GameOver from 'App/GameOver';
import InformationBar from 'App/InformationBar';
import PlayerName from 'Components/PlayerName';
import { Bid } from 'App/PlaceBid';

const StyledPlayerName = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: var(--player-name-indicator-z-index);
  border: solid #eee 3px;
  background-color: #fafafa;

  ${({ positionOnTable }) =>
    positionOnTable === 0 &&
    css`
      min-width: 150px;
      transform: translate(-50%, 25%);
    `}
  ${({ positionOnTable }) =>
    positionOnTable === 1 &&
    css`
      min-width: 150px;
      transform: translate(-50%, -50%);
      @media (min-width: 992px) {
        transform: translate(-100%, -50%);
      }
    `}
  ${({ positionOnTable }) =>
    positionOnTable === 2 &&
    css`
      min-width: 150px;
      transform: translate(-50%, -125%);
    `}
  ${({ positionOnTable }) =>
    positionOnTable === 3 &&
    css`
      min-width: 150px;
      transform: translate(-50%, -50%);
      @media (min-width: 992px) {
        transform: translate(-0%, -50%);
      }
    `}
  ${({ active }) =>
    active &&
    css`
      background-color: ${({ theme }) => theme.secondary};
      color: white;
    `}
`;

// {(phase === 'PlaceBids') &&
//  id === game.bid.highestBidBy && (
//      <span>
//        <span className="mx-2">-</span>{' '}
//        <Bid
//          bid={{ bid: game.bid.bid, suit: game.bid.trump }}
//          inverted
//        />
//      </span>
//  )}

const PlayersBid = ({ game, playerId }) => {
  const lastBidByPlayer = [...game.bids]
    .filter(({ bidBy }) => bidBy === playerId)
    .pop();
  if (lastBidByPlayer === undefined) {
    return null;
  }

  return (
    <span>
      <span className="bg-light text-dark p-2">
        <Bid bid={lastBidByPlayer} />
      </span>
      <span className="m-2">-</span>
    </span>
  );
};

const PlayerNameIndicator = ({
  positionOnTable,
  playerId,
  currentPlayer,
  game,
  phase,
}) => {
  return (
    <StyledPlayerName
      className={`p-4 shadow rounded font-weight-bold text-center`}
      positionOnTable={positionOnTable}
      active={playerId === currentPlayer}
    >
      <PlayerName playerId={playerId} />
      {(phase === 'PlayTricks' || phase === 'ShowResultOfTrick') &&
        playerId === game.bid.highestBidBy && (
          <span style={{ writingMode: 'horizontal' }}>
            <span className="m-2">-</span>{' '}
            <Bid bid={{ bid: game.bid.bid, suit: game.bid.trump }} inverted />
          </span>
        )}
    </StyledPlayerName>
  );
};
export default PlayerNameIndicator;
