/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Client } from 'boardgame.io/react';
import { MCTSBot } from 'boardgame.io/ai';
import { Local } from 'boardgame.io/multiplayer';
import { SocketIO } from 'boardgame.io/multiplayer';
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
import { useAuth } from 'auth/context';
import { useLobby } from 'lobby/context';
import { useInterval } from 'hooks';

const exitLobby = async ({
  connection,
  rooms,
  credentials = {},
  playerName,
  setErrorMsg,
  logout,
}) => {
  try {
    await connection.disconnect(rooms, credentials.credentials, playerName);
    setErrorMsg('');
    logout();
  } catch (error) {
    setErrorMsg(error.message);
  }
};

const createRoom = async (
  { connection, setErrorMsg },
  gameName,
  numPlayers
) => {
  try {
    await connection.create(gameName, numPlayers);
    await connection.refresh();
  } catch (error) {
    setErrorMsg(error.message);
  }
};

const joinRoom = async (
  { connection, playerName, joinGame, setErrorMsg },
  gameName,
  gameID,
  playerID
) => {
  try {
    const playerCredentials = await connection.join(
      gameName,
      gameID,
      playerID,
      playerName
    );

    joinGame(gameID, gameName, playerID, playerCredentials);
    await connection.refresh();
  } catch (error) {
    setErrorMsg(error.message);
  }
};

const leaveRoom = async (
  { connection, credentials = {}, playerName, leaveGame, setErrorMsg },
  gameName,
  gameID
) => {
  try {
    await connection.leave(
      gameName,
      gameID,
      credentials.credentials,
      playerName
    );
    leaveGame(gameID);

    await connection.refresh();
  } catch (error) {
    setErrorMsg(error.message);
  }
};

const startGame = (
  {
    setRunningGame,
    clientFactory,
    debug,
    gameComponents,
    setErrorMsg,
    gameServer,
  },
  gameName,
  gameOpts
) => {
  const gameCode = gameComponents.find(
    ({ game: { name } }) => name === gameName
  );
  if (!gameCode) {
    setErrorMsg('game ' + gameName + ' not supported');
    return;
  }

  let multiplayer = undefined;
  if (gameOpts.numPlayers > 1) {
    if (gameServer) {
      multiplayer = SocketIO({ server: gameServer });
    } else {
      multiplayer = SocketIO();
    }
  }

  if (gameOpts.numPlayers === 1) {
    const maxPlayers = gameCode.game.maxPlayers;
    let bots = {};
    for (let i = 1; i < maxPlayers; i++) {
      bots[i + ''] = MCTSBot;
    }
    multiplayer = Local({ bots });
  }

  const app = clientFactory({
    game: gameCode.game,
    board: gameCode.board,
    debug: debug,
    multiplayer,
  });

  const game = {
    app: app,
    gameId: gameOpts.gameID,
  };
  setRunningGame(game);
};

const PlayGame = ({
  gameComponents,
  debug,
  clientFactory,
  credentials = { playerId: undefined, credentials: undefined },
  runningGame,
  server,
}) => {
  const { gameId } = useParams();
  return (
    <runningGame.app
      gameID={gameId}
      playerID={credentials.playerId}
      credentials={credentials.credentials}
    />
  );
};

// debug: false,
// clientFactory: Client,
// refreshInterval: 2000,
const Lobby = ({
  debug = false,
  clientFactory = Client,
  refreshInterval = 2000,
  gameComponents,
  gameServer,
  lobbyServer,
  ...props
}) => {
  const [rooms, setRooms] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [runningGame, setRunningGame] = useState(undefined);
  const { username: playerName } = useAuth();
  const { credentials, logout, joinGame, leaveGame } = useLobby();
  const connection = LobbyConnection({
    server: lobbyServer,
    gameComponents: gameComponents,
    rooms,
    setRooms,
  });

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
                  errorMsg={errorMsg}
                  exitLobby={() =>
                    exitLobby({
                      connection,
                      rooms,
                      credentials,
                      playerName,
                      setErrorMsg,
                      logout,
                    })
                  }
                  createRoom={(gameName, numPlayers) =>
                    createRoom(
                      { connection, setErrorMsg },
                      gameName,
                      numPlayers
                    )
                  }
                  joinRoom={(gameName, gameID, playerID) =>
                    joinRoom(
                      { connection, playerName, joinGame, setErrorMsg },
                      gameName,
                      gameID,
                      playerID
                    )
                  }
                  leaveRoom={(gameName, gameID) =>
                    leaveRoom(
                      {
                        connection,
                        credentials,
                        playerName,
                        leaveGame,
                        setErrorMsg,
                      },
                      gameName,
                      gameID
                    )
                  }
                  startGame={(gameName, gameOpts) =>
                    startGame(
                      {
                        setRunningGame,
                        clientFactory,
                        debug,
                        gameComponents,
                        setErrorMsg,
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
