import React from 'react';
import { KlaverJassen } from 'GameLogic/Game';
import styled from 'styled-components';
import AprilFirst from 'App/AprilFirst';
import Lobby from 'lobby/react';
import { Local } from 'boardgame.io/multiplayer';
import KlaverJasBoard from 'KlaverJasBoard';
import KlaverJasClientFactory from 'KlaverJasClientFactory';
import config from 'config';
import AppProviders from 'Context';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

const LocalMultiPlayerGrid = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-template-areas: 'player-0 player-1 player-2 player-3';

  .game {
    width: 25vw;
  }
`;

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

const App = () => (
  <AppProviders>
    <Router>
      <Switch>
        <Route
          path="/practice"
          render={() => {
            const Client = KlaverJasClientFactory({});
            return (
              <AppContainer>
                <Client />
              </AppContainer>
            );
          }}
        />
        <Route
          path="/hoi"
          render={() => {
            const LocalKlaverJasClient = KlaverJasClientFactory({
              multiplayer: Local(),
            });
            return (
              <AppContainer>
                <LocalMultiPlayerGrid className="overflow-hidden">
                  <LocalKlaverJasClient playerID="0" />
                  <LocalKlaverJasClient playerID="1" />
                  <LocalKlaverJasClient playerID="2" />
                  <LocalKlaverJasClient playerID="3" />
                </LocalMultiPlayerGrid>
              </AppContainer>
            );
          }}
        />
        <Route exact path="/lobby">
          <AppContainer>
            <Lobby
              gameServer={config.gameServer}
              lobbyServer={config.lobbyServer}
              gameComponents={[{ game: KlaverJassen, board: KlaverJasBoard }]}
              debug={false}
              clientFactory={KlaverJasClientFactory}
            />
          </AppContainer>
        </Route>
        <Route>
          {config.public === true ? (
            <Redirect to="/lobby" />
          ) : (
            <AppContainer>
              <AprilFirst />
            </AppContainer>
          )}
        </Route>
      </Switch>
    </Router>
  </AppProviders>
);

// export default KlaverJasClient;
export default App;
