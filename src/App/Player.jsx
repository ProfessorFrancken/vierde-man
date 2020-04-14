import React from 'react';
import PlaceBid from 'App/PlaceBid';
import styled from 'styled-components';
import PlayerHand from 'Components/PlayerHand';
import ShowResultsOfTrick from 'App/ShowResultsOfTrick';
import ShowResultsOfHand from 'App/ShowResultOfHand';
import PlayedCards from 'App/PlayedCards';
import GameOver from 'App/GameOver';
import InformationBar from 'App/InformationBar';
import PlayerNameIndicator from 'Components/PlayerNameIndicator';

const PlayerContainer = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
  grid-area: ${(props) => 'player-' + props.id};
`;

const KlaverJasTable = styled.div`
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;

  display: grid;

  // Use minmax: https://stackoverflow.com/questions/54099056/grid-display-columns-have-not-equal-width
  grid-template-rows: minmax(0, 1fr) 3fr minmax(0, 1fr);
  grid-template-columns: minmax(0, 1fr) 3fr minmax(0, 1fr);
  grid-template-areas:
    'p2  p2  p2'
    'p1  a  p3'
    'p0  p0 p0';
`;

const Action = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  grid-row-start: p2;
  grid-row-end: p1;
  grid-column-start: p2;
  grid-column-end: p3;
`;
const PlayerHandArea = styled.div`
  grid-area: ${(props) => 'p' + props.id};
  position: relative;
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
  practice = false,
}) => {
  const playerId = id;

  return (
    <PlayerContainer id={id} className="game">
      <InformationBar
        playerId={playerId}
        game={game}
        currentPlayer={currentPlayer}
        phase={phase}
        rounds={game.rounds}
        playedTricks={game.playedTricks}
        wij={game.wij}
        zij={game.zij}
        bid={game.bid}
      />

      <KlaverJasTable
        className="klaverjas-table overflow-hidden"
        playerId={playerId}
        currentPlayer={currentPlayer}
      >
        <Action>
          {phase === 'PlaceBids' && (
            <PlaceBid
              placeBid={moves.PlaceBid}
              pass={moves.Pass}
              currentBids={game.bids}
              currentPlayer={currentPlayer}
              active={playerId === currentPlayer}
            />
          )}

          {phase === 'ShowResultOfTrick' && (
            <ShowResultsOfTrick
              moves={moves}
              currentPlayer={currentPlayer}
              playerId={playerId}
              currentTrick={game.currentTrick}
              trump={game.bid.trump}
              continueTrickAutomatically={game.continueTrickAutomatically}
              playersThatWantToContinue={game.playersThatWantToContinue}
            />
          )}
          {(phase === 'PlayTricks' || phase === 'ShowResultOfTrick') && (
            <PlayedCards
              cards={game.currentTrick.playedCards}
              startingPlayer={game.currentTrick.startingPlayer}
              playerId={playerId}
            />
          )}
          {phase === 'ShowResultOfHand' && (
            <ShowResultsOfHand
              game={game}
              moves={moves}
              currentPlayer={currentPlayer}
              playerId={playerId}
              currentTrick={game.currentTrick}
              trump={game.bid.trump}
              continueTrickAutomatically={game.continueTrickAutomatically}
              playersThatWantToPlayNextHand={game.playersThatWantToPlayNextHand}
            />
          )}

          {phase === null && <GameOver />}
        </Action>

        {[0, 1, 2, 3].map((positionOnTable) => {
          const id = (playerId + positionOnTable) % 4;
          return (
            <PlayerHandArea id={positionOnTable} key={positionOnTable}>
              <PlayerNameIndicator
                positionOnTable={positionOnTable}
                playerId={id}
                currentPlayer={currentPlayer}
                game={game}
                phase={phase}
              />
              <PlayerHand
                game={game}
                hand={game.hands[id]}
                phase={phase}
                playerId={id}
                moves={moves}
                visible={id === playerId}
                active={phase === 'PlayTricks' && currentPlayer === id}
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
