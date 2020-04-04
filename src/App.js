import React from 'react';
import { Client } from 'boardgame.io/react';
import { KlaverJassen } from 'GameLogic/Game';
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
    'player-0 player-1 player-2 player-3';

  .klaverjas-table {
    width: 25vw;
  }
`;

const SinglePlayer = styled.div`
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: 'player-0 player-1 player-2 player-3';

  --x-offset: 50%;
  --y-offset: 30%;
  --x-scale: 25%;
  --y-scale: 5%;
  --cardScale: 1;

  // Small devices (landscape phones, 576px and up)
  @media (min-width: 250px) {
    --cardScale: 1.1;

    --x-offset: 50%;
    --y-offset: 30%;
    --x-scale: 25%;
    --y-scale: 3%;
  }

  @media (min-width: 400px) {
    --cardScale: 1.4;
  }

  // Small devices (landscape phones, 576px and up)
  @media (min-width: 576px) {
    --cardScale: 1.6;

    --x-offset: 50%;
    --y-offset: 30%;
    --x-scale: 25%;
    --y-scale: 5%;
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) {
    --cardScale: 1.8;
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
    --cardScale: 2;
  }

  // Extra large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) {
    --cardScale: 2.4;
    --x-scale: 35%;
    --y-scale: 6%;
    --y-offset: 40%;
  }
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
          {!(urlParams.has('hoi') || urlParams.has('practice')) ? (
            <AprilFirst />
          ) : (
            <SinglePlayer>
              <Player
                id={playerID}
                game={G}
                moves={moves}
                phase={phase}
                currentPlayer={parseInt(ctx.currentPlayer, 10)}
                practice={urlParams.has('practice')}
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
const KlaverJasClientFactory = multiplayer =>
  Client({
    game: KlaverJassen,
    numPlayers: 4,
    debug: true,
    board: DebugApp,
    multiplayer,
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
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has('practice')) {
    const Client = KlaverJasClientFactory(undefined);
    return <Client />;
  }

  const LocalKlaverJasClient = KlaverJasClientFactory(Local());

  return (
    <PlayerGrid>
      <LocalKlaverJasClient playerID="0" />
      <LocalKlaverJasClient playerID="1" />
      <LocalKlaverJasClient playerID="2" />
      <LocalKlaverJasClient playerID="3" />
    </PlayerGrid>
  );
};

export default LocalMultiplyaerApp;
