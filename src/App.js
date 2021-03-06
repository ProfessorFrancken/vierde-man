import React from 'react';
import styled from 'styled-components';
import AprilFirst from 'App/AprilFirst';
import { Login, PlayGame, LobbiesContainer } from 'lobby/react';
import { Local } from 'boardgame.io/multiplayer';
import KlaverJasClientFactory from 'KlaverJasClientFactory';
import config from 'config';
import AppProviders from 'Context';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Layout from 'ui/layout';

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
  --primary: ${({ theme }) => theme.primary};

  .text-primary {
    color: var(--primary) !important;
  }
  .bg-primary {
    background-color: var(--primary) !important;
  }
  .btn-primary {
    background-color: var(--primary) !important;
  }
  .bg-primary-light {
    background-color: ${({ theme }) => theme.primaryLight} !important;
  }
  .border-primary {
    border-color: var(--primary) !important;
  }

  .btn.bg-primary {
    :hover,
    :focus {
      background-color: ${({ theme }) => theme.primaryLight} !important;
    }
  }

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

  @media (min-width: 300px) {
    --cardScale: 1.4;
  }

  @media (min-width: 400px) {
    --cardScale: 1.6;
    --x-scale: 30%;
  }

  @media (min-width: 500px) {
    --cardScale: 1.8;
  }

  // Small devices (landscape phones, 576px and up)
  @media (min-width: 576px) {
    --cardScale: 1.8;

    --x-offset: 50%;
    --y-offset: 30%;
    --x-scale: 35%;
    --y-scale: 5%;
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) {
    --cardScale: 2;
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
    --cardScale: 2.2;
  }

  // Extra large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) {
    --cardScale: 2.4;
    --x-scale: 40%;
    --y-scale: 7%;
    --y-offset: 40%;
  }
`;

const App = () => (
  <AppProviders>
    <AppContainer>
      <Router>
        <Switch>
          <Route
            path="/practice"
            render={() => {
              const Client = KlaverJasClientFactory({});
              return <Client />;
            }}
          />
          <Route
            path="/hoi"
            render={() => {
              const LocalKlaverJasClient = KlaverJasClientFactory({
                multiplayer: Local(),
              });
              return (
                <LocalMultiPlayerGrid className="overflow-hidden">
                  <LocalKlaverJasClient playerID="0" />
                  <LocalKlaverJasClient playerID="1" />
                  <LocalKlaverJasClient playerID="2" />
                  <LocalKlaverJasClient playerID="3" />
                </LocalMultiPlayerGrid>
              );
            }}
          />
          <Route exact path="/login">
            <Login />
          </Route>
          <Route path="/games/:gameName/:gameId">
            <PlayGame />
          </Route>
          <Route exact path="/lobby">
            <Layout>
              <LobbiesContainer />
            </Layout>
          </Route>
          <Route>
            <Redirect to="/lobby" />
          </Route>
          <Route>
            {config.public === true ? <Redirect to="/lobby" /> : <AprilFirst />}
          </Route>
        </Switch>
      </Router>
    </AppContainer>
  </AppProviders>
);

// export default KlaverJasClient;
export default App;
