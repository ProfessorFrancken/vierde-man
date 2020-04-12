import React from 'react';
import PlaceBid from 'App/PlaceBid';
import { PlayerToStartCurrentTrick } from 'GameLogic/Phases/PlayTricks';
import styled, { css } from 'styled-components';
import PlayerHand from 'Components/PlayerHand';
import ShowResultsOfTrick from 'App/ShowResultsOfTrick';
import ShowResultsOfHand from 'App/ShowResultOfHand';
import PlayedCards from 'App/PlayedCards';
import GameOver from 'App/GameOver';
import InformationBar from 'App/InformationBar';

const PlayerContainer = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
  border: thin solid #dddddd;
  grid-area: ${(props) => 'player-' + props.id};
`;

const KlaverJasTable = styled.div`
  border: solid 0.5em #fdb76582;

  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;

  @media (min-width: 768px) {
      border-width: 1em;
   }

${({ currentPlayer, playerId }) =>
  currentPlayer === playerId % 4 &&
  css`
    border-bottom-color: var(--active-border-color);
  `}
${({ currentPlayer, playerId }) =>
  currentPlayer === (playerId + 1) % 4 &&
  css`
    border-left-color: var(--active-border-color);
  `}
${({ currentPlayer, playerId }) =>
  currentPlayer === (playerId + 2) % 4 &&
  css`
    border-top-color: var(--active-border-color);
  `}
${({ currentPlayer, playerId }) =>
  currentPlayer === (playerId + 3) % 4 &&
  css`
    border-right-color: var(--active-border-color);
  `}

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
