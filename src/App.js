import React from 'react';
import { Client } from 'boardgame.io/react';
import { KlaverJassen } from 'GameLogic/Game';
import styled from 'styled-components';
import AprilFirst from 'App/AprilFirst';
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';
import { loadedSoundsMiddleware, playSoundsMiddleware } from 'Sound';
import { Lobby } from 'boardgame.io/react';
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import KlaverJasBoard from 'KlaverJasBoard';
import './Lobby.css';

const LocalMultiPlayerGrid = styled.div`
  display: flex;
  height: 100vh;
  grid-template-rows: 1fr 1fr 1fr 1fr;
    'player-0 player-1 player-2 player-3';

  .klaverjas-table {
    width: 25vw;
  }
`;

// TODO: when using a Lobby, consider using the ClientFactory to set enhancer
// https://github.com/nicolodavis/boardgame.io/blob/master/src/lobby/react.js
// const defaultMulti = SocketIO({
//       server: 'http://api.vierde-man.nl.localhost'
//     });
const KlaverJasClientFactory = multiplayer =>
  Client({
    game: KlaverJassen,
    numPlayers: 4,
    debug: true,
    board: KlaverJasBoard,
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

const config = {
  gameServer: process.env.REACT_APP_GAME_SERVER,
  lobbyServer: process.env.REACT_APP_LOBBY_SERVER
};

const KlaverJasLobby = () => (
  <div>
    <Lobby
      gameServer={config.gameServer}
      lobbyServer={config.lobbyServer}
      gameComponents={[{ game: KlaverJassen, board: KlaverJasBoard }]}
      debug={true}
      clientFactory={({ game, board, debug, multiplayer }) => {
        return Client({
          game: KlaverJassen,
          numPlayers: 4,
          debug: false,
          board: KlaverJasBoard,
          multiplayer: SocketIO({
            server: config.gameServer
          }),
          loading: props => {
            return 'Loading component';
          },
          enhancer: applyMiddleware(
            logger,
            playSoundsMiddleware,
            loadedSoundsMiddleware
          )
        });
      }}
    />
  </div>
);

const AppContainer = styled.div`
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

const App = () => {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has('practice')) {
    const Client = KlaverJasClientFactory(undefined);
    return (
      <AppContainer>
        <Client />
      </AppContainer>
    );
  }
  if (urlParams.has('hoi')) {
    const LocalKlaverJasClient = KlaverJasClientFactory(Local());
    return (
      <LocalMultiPlayerGrid>
        <LocalKlaverJasClient playerID="0" />
        <LocalKlaverJasClient playerID="1" />
        <LocalKlaverJasClient playerID="2" />
        <LocalKlaverJasClient playerID="3" />
      </LocalMultiPlayerGrid>
    );
  }
  if (urlParams.has('lobby')) {
    return (
      <AppContainer>
        <KlaverJasLobby />;
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <AprilFirst />
    </AppContainer>
  );
};

// export default KlaverJasClient;
export default App;
