import React from 'react';
import { Client } from 'boardgame.io/react';
import { KlaverJassen } from 'GameLogic/Game';
import './App.css';
import styled from 'styled-components';
import { default as DebugPanel } from 'App/ScoreBoard';
import Player from 'App/Player';
import AprilFirst from 'App/AprilFirst';
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';
import playCardSfx from 'assets/sounds/card_play.mp3';
import soundsMiddleware from 'redux-sounds';

const PlayerGrid = styled.div`
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'player-0 player-1'
    'player-3 player-2';
`;

const SinglePlayer = styled.div`
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    'player-0 player-1'
    'player-3 player-2';
`;

const DebugApp = props => {
  const urlParams = new URLSearchParams(window.location.search);
  const { G, moves, ctx } = props;
  const { phase } = ctx;
  return (
    <div className="App">
      <div className="d-flex justify-content-between table-decoration">
        <div className="d-flex flex-column flex-grow-1">
          {!urlParams.has('hoi') ? (
            <AprilFirst />
          ) : (
            <SinglePlayer>
              <Player
                id={0}
                name="Mark"
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

  return (
    <div className="App">
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-column flex-grow-1">
          <PlayerGrid>
            <Player
              id={0}
              name="Mark"
              game={G}
              moves={moves}
              phase={phase}
              currentPlayer={parseInt(ctx.currentPlayer, 10)}
            />
            <Player
              id={1}
              name="Anna"
              game={G}
              moves={moves}
              phase={phase}
              currentPlayer={parseInt(ctx.currentPlayer, 10)}
            />
            <Player
              id={2}
              name="Arjen"
              game={G}
              moves={moves}
              phase={phase}
              currentPlayer={parseInt(ctx.currentPlayer, 10)}
            />
            <Player
              id={3}
              name="Su"
              game={G}
              moves={moves}
              phase={phase}
              currentPlayer={parseInt(ctx.currentPlayer, 10)}
            />
          </PlayerGrid>
        </div>
        {false && <DebugPanel {...G} />}
      </div>
    </div>
  );
};

const customMiddleware = store => next => action => {
  // NOTE: we only check if a PlayCard move is made, we don't yet check if it
  // is / was a valid move
  if (action.type === 'MAKE_MOVE' && action.payload.type === 'PlayCard') {
    return next({
      ...action,
      meta: { ...action.meta, sound: { play: 'playCard' } }
    });
  }

  return next(action);
};
const soundsData = {
  playCard: playCardSfx
};

// Pre-load our middleware with our sounds data.
const loadedSoundsMiddleware = soundsMiddleware(soundsData);

const KlaverJasApp = Client({
  game: KlaverJassen,
  numPlayers: 4,
  debug: true,
  board: DebugApp,
  loading: props => {
    return 'Loading component';
  },
  enhancer: applyMiddleware(logger, customMiddleware, loadedSoundsMiddleware)
});

export default KlaverJasApp;
// export default App
