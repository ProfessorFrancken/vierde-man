import React from 'react';
import { Client } from 'boardgame.io/react';
import { KlaverJassen } from 'GameLogic/Game';
import './App.css';
import styled from 'styled-components';
import Player from 'App/Player';
import AprilFirst from 'App/AprilFirst';
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';
import { loadedSoundsMiddleware, playSoundsMiddleware } from 'Sound';
import { Local } from 'boardgame.io/multiplayer';

const PlayerGrid = styled.div`
  display: flex;
  height: 100vh;
  grid-template-rows: 1fr 1fr 1fr 1fr;
    'player-0 player-1 player-2 player-3'
`;

const SinglePlayer = styled.div`
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: 'player-0 player-1 player-2 player-3';
`;

const DebugApp = props => {
  const urlParams = new URLSearchParams(window.location.search);
  const { G, moves, ctx } = props;
  const { phase } = ctx;
  const playerID = parseInt(props.playerID, 10) || 0;

  return (
    <div className="App">
      <div className="d-flex justify-content-between table-decoration">
        <div className="d-flex flex-column flex-grow-1">
          {!urlParams.has('hoi') ? (
            <AprilFirst />
          ) : (
            <SinglePlayer>
              <Player
                id={playerID}
                game={G}
                moves={moves}
                phase={phase}
                currentPlayer={parseInt(ctx.currentPlayer, 10)}
              />
            </SinglePlayer>
          )}
        </div>
      </div>
    </div>
  );
};

// TODO: when using a Lobby, consider using the ClientFactory to set enhancer
// https://github.com/nicolodavis/boardgame.io/blob/master/src/lobby/react.js
const KlaverJasClient = Client({
  game: KlaverJassen,
  numPlayers: 4,
  debug: true,
  board: DebugApp,
  multiplayer: Local(),
  loading: props => {
    return 'Loading component';
  },
  enhancer: applyMiddleware(
    logger,
    playSoundsMiddleware,
    loadedSoundsMiddleware
  )
});

const LocalMultiplyaerApp = props => {
  return (
    <PlayerGrid>
      <KlaverJasClient playerID="0" />
      <KlaverJasClient playerID="1" />
      <KlaverJasClient playerID="2" />
      <KlaverJasClient playerID="3" />
    </PlayerGrid>
  );
};

export default LocalMultiplyaerApp;
