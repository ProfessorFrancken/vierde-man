/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Client } from 'boardgame.io/react';
import { LobbyConnection } from './connection';

import Lobbies from './Lobbies';
import Login from 'lobby/login-form';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useParams,
} from 'react-router-dom';
import { useError } from 'Context';
import { useAuth } from 'auth/context';
import { useLobby } from 'lobby/context';
import { useInterval } from 'hooks';

const PlayGame = ({
  gameComponents,
  debug,
  clientFactory,
  credentials = { playerId: undefined, playerCredentials: undefined },
  runningGame,
  server,
}) => {
  const { gameId } = useParams();
  return (
    <runningGame.app
      gameID={gameId}
      playerID={credentials.playerId}
      credentials={credentials.playerCredentials}
    />
  );
};

const Lobby = ({
  debug = false,
  clientFactory = Client,
  refreshInterval = 2000,
  gameComponents,
  gameServer,
  lobbyServer,
}) => {
  const { error } = useError();
  const { username: playerName } = useAuth();
  const {
    credentials,
    joinRoom,
    leaveRoom,
    createRoom,
    exitLobby,
    rooms,
    setRooms,
    startGame,
    runningGame,
  } = useLobby();
  const connection = LobbyConnection({
    server: lobbyServer,
    gameComponents: gameComponents,
    rooms,
    setRooms,
  });

  useEffect(() => {
    connection.refresh();
  }, [lobbyServer, gameComponents]);

  useInterval(() => {
    connection.refresh();
  }, refreshInterval);
  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route path="/games/:gameId">
          {runningGame ? (
            <PlayGame
              gameComponents={gameComponents}
              clientFactory={clientFactory}
              debug={debug}
              server={gameServer}
              runningGame={runningGame}
              credentials={credentials}
            />
          ) : (
            <Redirect to="/lobby" />
          )}
        </Route>
        <Route exact path="/lobby">
          {playerName === undefined && <Redirect to={`/login`} />}
          {runningGame ? (
            <Redirect to={`games/${runningGame.gameId}`} />
          ) : (
            <div id="lobby-view" className="p-2 p-md-5">
              {playerName !== undefined && (
                <Lobbies
                  playerName={playerName}
                  gameComponents={gameComponents}
                  errorMsg={error}
                  exitLobby={() => exitLobby(connection)}
                  createRoom={(gameName, numPlayers) =>
                    createRoom(connection, gameName, numPlayers)
                  }
                  joinRoom={(gameName, gameID, playerID) =>
                    joinRoom(connection, gameName, gameID, playerID)
                  }
                  leaveRoom={(gameName, gameID) =>
                    leaveRoom(connection, gameName, gameID)
                  }
                  startGame={(gameName, gameOpts) =>
                    startGame(
                      {
                        clientFactory,
                        debug,
                        gameComponents,
                        gameServer,
                      },
                      gameName,
                      gameOpts
                    )
                  }
                  rooms={rooms}
                />
              )}
            </div>
          )}
        </Route>
        <Route>
          <Redirect to="/lobby" />
        </Route>
      </Switch>
    </Router>
  );
};

Lobby.propTypes = {
  gameComponents: PropTypes.array.isRequired,
  lobbyServer: PropTypes.string,
  gameServer: PropTypes.string,
  debug: PropTypes.bool,
  clientFactory: PropTypes.func,
  refreshInterval: PropTypes.number,
};

export default Lobby;
