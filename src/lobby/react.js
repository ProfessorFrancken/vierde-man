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
  username,
  setErrorMsg,
  logout,
}) => {
  try {
    await connection.disconnect(rooms, credentials.credentials, username);
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
  { connection, username, joinGame, setErrorMsg },
  gameName,
  gameID,
  playerID
) => {
  try {
    const playerCredentials = await connection.join(
      gameName,
      gameID,
      playerID,
      username
    );

    joinGame(gameID, gameName, playerID, playerCredentials);
    await connection.refresh();
  } catch (error) {
    setErrorMsg(error.message);
  }
};

const leaveRoom = async (
  { connection, credentials = {}, username, leaveGame, setErrorMsg },
  gameName,
  gameID
) => {
  try {
    await connection.leave(gameName, gameID, credentials.credentials, username);
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

/**
 * Lobby
 *
 * React lobby component.
 *
 * @param {Array}  gameComponents - An array of Board and Game objects for the supported games.
 * @param {string} lobbyServer - Address of the lobby server (for example 'localhost:8000').
 *                               If not set, defaults to the server that served the page.
 * @param {string} gameServer - Address of the game server (for example 'localhost:8001').
 *                              If not set, defaults to the server that served the page.
 * @param {function} clientFactory - Function that is used to create the game clients.
 * @param {number} refreshInterval - Interval between server updates (default: 2000ms).
 * @param {bool}   debug - Enable debug information (default: false).
 *
 * Returns:
 *   A React component that provides a UI to create, list, join, leave, play or spectate game instances.
 */
const Lobby = (props) => {
  const {
    errorMsg,
    gameComponents,
    credentials,
    runningGame,
    username: playerName,
    rooms,
    clientFactory,
    debug,
    gameServer,
  } = props;

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
                  exitLobby={() => exitLobby(props)}
                  createRoom={(gameName, numPlayers) =>
                    createRoom(props, gameName, numPlayers)
                  }
                  joinRoom={(gameName, gameID, playerID) =>
                    joinRoom(props, gameName, gameID, playerID)
                  }
                  leaveRoom={(gameName, gameID) =>
                    leaveRoom(props, gameName, gameID)
                  }
                  startGame={(gameName, gameOpts) =>
                    startGame(props, gameName, gameOpts)
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

// debug: false,
// clientFactory: Client,
// refreshInterval: 2000,
const FunctionalLobby = ({
  debug = false,
  clientFactory = Client,
  refreshInterval = 2000,
  ...props
}) => {
  const [rooms, setRooms] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [runningGame, setRunningGame] = useState(undefined);
  const { username } = useAuth();
  const lobby = useLobby();
  const connection = LobbyConnection({
    server: props.lobbyServer,
    gameComponents: props.gameComponents,
    playerName: username,
    playerCredentials: lobby.credentials
      ? lobby.credentials.credentials
      : undefined,
    rooms,
    setRooms,
  });

  useInterval(() => {
    connection.refresh();
  }, refreshInterval);

  return (
    <Lobby
      {...lobby}
      {...props}
      debug={debug}
      clientFactory={clientFactory}
      refreshInterval={refreshInterval}
      username={username}
      errorMsg={errorMsg}
      setErrorMsg={setErrorMsg}
      runningGame={runningGame}
      setRunningGame={setRunningGame}
      rooms={rooms}
      setRooms={setRooms}
      connection={connection}
    />
  );
};

export default FunctionalLobby;
