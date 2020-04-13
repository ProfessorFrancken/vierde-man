import React, { useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { useAuth } from 'auth/context';
import { useError } from 'Context';
import { SocketIO } from 'boardgame.io/multiplayer';

const LobbyContext = React.createContext();

const localStoragePlayerRoomsKey = '__vierde_man_player_rooms__';

function LobbyProvider(props) {
  const { logout: authLogout, username } = useAuth();
  const playerName = username;
  const { setError } = useError();
  const [playerRooms, setPlayerRooms] = useLocalStorageState(
    localStoragePlayerRoomsKey,
    []
  );

  const [rooms, setRooms] = useState([]);
  const [runningGame, setRunningGame] = useState(undefined);

  const logout = () => {
    authLogout();
    setPlayerRooms([]);
  };

  const catchErrors = (fn) => async (...args) => {
    try {
      await fn(...args);
    } catch (error) {
      setError(error.message);
    }
  };

  const refresh = (connection) => connection.refresh();

  const joinRoom = async (connection, gameName, gameId, playerId) => {
    const playerCredentials = await connection.join(
      gameId,
      playerId,
      playerName
    );

    setPlayerRooms([
      ...playerRooms,
      { playerId, gameId, gameName, playerCredentials },
    ]);
  };
  const leaveGame = (gameId) => {};

  const leaveRoom = async (connection, gameName, gameId) => {
    const room = playerRooms.find((room) => room.gameId === gameId);
    await connection.leave(gameId, room.playerCredentials, playerName);

    setPlayerRooms(playerRooms.filter((room) => room.gameId !== gameId));
  };

  const createRoom = async (connection, gameName, numPlayers) => {
    await connection.create(gameName, numPlayers);
  };

  const exitLobby = async (connection) => {
    await connection.disconnect(rooms, playerRooms, playerName);
    setError('');
    logout();
  };

  const startGame = (
    { clientFactory, debug, gameComponents, gameServer },
    gameName,
    gameOpts
  ) => {
    const gameCode = gameComponents.find(
      ({ game: { name } }) => name === gameName
    );
    if (!gameCode) {
      setError('game ' + gameName + ' not supported');
      return;
    }

    const multiplayer = gameServer
      ? SocketIO({ server: gameServer })
      : SocketIO();

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

  return (
    <LobbyContext.Provider
      value={{
        playerRooms,
        logout,
        refresh: catchErrors(refresh),
        joinRoom: catchErrors(joinRoom),
        leaveGame: catchErrors(leaveGame),
        leaveRoom: catchErrors(leaveRoom),
        createRoom: catchErrors(createRoom),
        exitLobby: catchErrors(exitLobby),
        rooms,
        setRooms,
        startGame,
        runningGame,
      }}
      {...props}
    />
  );
}

function useLobby() {
  const context = React.useContext(LobbyContext);
  if (context === undefined) {
    throw new Error(`useLobby must be used within a LobbyProvider`);
  }
  return context;
}

export { LobbyProvider, useLobby };
