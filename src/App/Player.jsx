import React from 'react';
import PlaceBid from 'App/PlaceBid';
import { PlayerToStartCurrentTrick } from 'GameLogic/Phases/PlayTricks';
import styled from 'styled-components';
import Score from 'App/Score';
import PlayerHand from 'Components/PlayerHand';
import ShowResultsOfTrick from 'App/ShowResultsOfTrick';
import PlayedCards from 'App/PlayedCards';

const PlayerContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
  border: thin solid #dddddd;
  grid-area: ${props => 'player-' + props.id};
`;

const KlaverJasTable = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-rows: 1fr 3fr 1fr;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-areas:
    '.  p2 .'
    'p1 a  p3'
    't  p0 s';
`;

const Action = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-area: a;
  flex-direction: column;
`;
const PlayerHandArea = styled.div`
  grid-area: ${props => 'p' + props.id};

  ul {
    transform: ${({ id }) =>
      id === 0
        ? ''
        : id === 1
        ? 'rotate(90deg)'
        : id === 2
        ? 'rotate(180deg)'
        : 'rotate(-90deg)'};
  }
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
  const playerId = id;

  return (
    <PlayerContainer id={id}>
      <KlaverJasTable className="p-2 overflow-hidden" flex-grow-1>
        <Action>
          {phase === 'PlaceBids' && (
            <PlaceBid
              placeBid={moves.PlaceBid}
              pass={moves.Pass}
              currentBids={game.bids}
              currentPlayer={currentPlayer}
            />
          )}
          {phase === 'PlayTricks' && (
            <PlayedCards
              cards={game.currentTrick.playedCards}
              startingPlayer={PlayerToStartCurrentTrick(game, {
                numPlayers: 4
              })}
              playerId={playerId}
            />
          )}

          {phase === 'ShowResultOfTrick' && (
            <ShowResultsOfTrick
              game={game}
              moves={moves}
              playerId={playerId}
              currentPlayer={currentPlayer}
            />
          )}
        </Action>

        <Score game={game} />

        {[0, 1, 2, 3].map(positionId => {
          const id = (playerId + positionId) % 4;
          return (
            <PlayerHandArea id={positionId} key={positionId}>
              <PlayerHand
                game={game}
                hand={game.hands[id]}
                playerId={id}
                moves={moves}
                visible={currentPlayer === id}
              />
            </PlayerHandArea>
          );
        })}
      </KlaverJasTable>
    </PlayerContainer>
  );
};

export default Player;
