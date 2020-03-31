import React from 'react';
import PlaceBid from 'App/PlaceBid';
import { playerIsAllowedToPlayCard } from 'GameLogic/Phases/PlayTricks';
import styled from 'styled-components';
import Header from 'App/Header';
import Card from 'Components/Card';
import PlayerHand from 'Components/PlayerHand';

const PlayerContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
  border: thin solid #dddddd;
  grid-area: ${props => 'player-' + props.id};
  background-color: ${props =>
    props.id === 1 || props.id === 3 ? '#fafafa' : '#fafefa'};
`;

const KlaverjasTable = styled.div`
  display: grid;
  width: 100%;
  height: 100;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'corner player-2 corner'
    'player-1 action player-3'
    'corner player-0 corner';
`;

const Action = styled.div`
  grid-area: action;
`;
const PlayerHandArea = styled.div`
  grid-area: ${props => 'player-' + props.id};
`;

const Player = ({
  id,
  name,
  cards = [],
  selectedSuit = id === 1 ? 'sans' : 'hearts',
  selectedBid = 90,
  moves,
  game,
  phase,
  currentPlayer
}) => {
  const playerHand = game.hands[id];
  const playerIsActive = currentPlayer === id;

  return (
    <PlayerContainer id={id}>
      <Header
        game={game}
        phase={phase}
        currentBids={game.bids}
        currentPlayer={currentPlayer}
      />
      <div className="p-3 flex-grow-1 d-flex flex-column justify-content-between w-100">
        <header className="d-none justify-content-between w-100">
          <h1 className="h5">{name}</h1>
          <small>
            {playerIsActive
              ? phase
              : `Waiting for ${currentPlayer} to make its turn...`}
          </small>
        </header>

        {!playerIsActive && (
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <h3 className="text-center text-muted">Waiting for turn</h3>
          </div>
        )}
        {playerIsActive && (
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <h3 className="text-center text-muted"></h3>
          </div>
        )}
        {playerIsActive && phase === 'PlaceBids' && (
          <PlaceBid
            placeBid={moves.PlaceBid}
            pass={moves.Pass}
            currentBids={game.bids}
            currentPlayer={currentPlayer}
          />
        )}

        <div>
          <PlayerHand
            game={game}
            hand={playerHand}
            playerId={id}
            moves={moves}
          />
        </div>
      </div>
    </PlayerContainer>
  );
};

export default Player;
