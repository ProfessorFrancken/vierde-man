import React from 'react';
import { Client } from 'boardgame.io/react';
import { KlaverJassen } from 'GameLogic/Game';
import './App.css';
import styled from 'styled-components';
import { default as DebugPanel } from 'App/ScoreBoard';
import Player from 'App/Player';

const PlayerGrid = styled.div`
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'player-0 player-1'
    'player-3 player-2';
`;

const DebugApp = props => {
  const { G, moves, ctx } = props;
  const { phase } = ctx;

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

const KlaverJasApp = Client({
  game: KlaverJassen,
  numPlayers: 4,
  debug: false,
  board: DebugApp,
  loading: props => {
    return 'Loading component';
  }
});

export default KlaverJasApp;
// export default App
