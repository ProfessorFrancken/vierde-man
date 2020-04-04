import React from 'react';
import PlaceBid from 'App/PlaceBid';
import { PlayerToStartCurrentTrick } from 'GameLogic/Phases/PlayTricks';
import styled from 'styled-components';
import Score from 'App/Score';
import PlayerHand from 'Components/PlayerHand';
import ShowResultsOfTrick from 'App/ShowResultsOfTrick';
import ShowResultsOfHand from 'App/ShowResultOfHand';
import PlayedCards from 'App/PlayedCards';
import GameOver from 'App/GameOver';

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
  width: 100vw;
  height: 100vh;

  // Use minmax: https://stackoverflow.com/questions/54099056/grid-display-columns-have-not-equal-width
  grid-template-rows: minmax(0, 1fr) 3fr minmax(0, 1fr);
  grid-template-columns: minmax(0, 1fr) 3fr minmax(0, 1fr);
  grid-template-areas:
    's   p2 .'
    'p1  a  p3'
    'p0  p0 p0';
`;

const Action = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  grid-row-start: s;
  grid-row-end: p1;
  grid-column-start: s;
  grid-column-end: p3;
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
  currentPlayer,
  practice = false
}) => {
  const playerId = id;

  return (
    <PlayerContainer id={id}>
      <KlaverJasTable className="klaverjas-table overflow-hidden" flex-grow-1>
        <Action>
          {phase === 'PlaceBids' && (
            <PlaceBid
              placeBid={moves.PlaceBid}
              pass={moves.Pass}
              currentBids={game.bids}
              currentPlayer={currentPlayer}
              active={playerId === currentPlayer || practice}
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
              moves={moves}
              currentPlayer={currentPlayer}
              currentTrick={game.currentTrick}
              trump={game.bid.trump}
              continueTrickAutomatically={game.continueTrickAutomatically}
            />
          )}
          {phase === 'ShowResultOfHand' && (
            <ShowResultsOfHand
              game={game}
              moves={moves}
              currentPlayer={currentPlayer}
              currentTrick={game.currentTrick}
              trump={game.bid.trump}
              continueTrickAutomatically={game.continueTrickAutomatically}
            />
          )}

          {phase === null && <GameOver />}
        </Action>

        {phase !== null && (
          <Score
            rounds={game.rounds}
            playedTricks={game.playedTricks}
            wij={game.wij}
            zij={game.zij}
            bid={game.bid}
          />
        )}

        {[0, 1, 2, 3].map(positionOnTable => {
          const id = (playerId + positionOnTable) % 4;
          return (
            <PlayerHandArea id={positionOnTable} key={positionOnTable}>
              <PlayerHand
                game={game}
                hand={game.hands[id]}
                phase={phase}
                playerId={id}
                moves={moves}
                visible={practice ? id === currentPlayer : id === playerId}
                active={phase === 'PlayTricks'}
                positionOnTable={positionOnTable}
              />
            </PlayerHandArea>
          );
        })}
      </KlaverJasTable>
    </PlayerContainer>
  );
};

export default Player;
