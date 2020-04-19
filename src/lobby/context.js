import React, { useState, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { useAuth } from 'auth/context';
import { useError } from 'Context';
import { SocketIO } from 'boardgame.io/multiplayer';
import { LobbyConnection } from './connection';
import { useInterval } from 'hooks';

const LobbyContext = React.createContext();

const localStoragePlayerRoomsKey = '__vierde_man_player_rooms__';

function LobbyProvider({
  gameServer,
  lobbyServer,
  debug,
  clientFactory,
  gameComponents,
  ...props
}) {
  const { logout: authLogout, username } = useAuth();
  const playerName = username;
  const { setError } = useError();
  const [playerRooms, setPlayerRooms] = useLocalStorageState(
    localStoragePlayerRoomsKey,
    []
  );

  const [rooms, setRooms] = useState([]);
  const [runningGame, setRunningGame] = useState(undefined);

  const connection = LobbyConnection({
    server: lobbyServer,
    gameComponents: gameComponents,
    rooms,
    setRooms,
  });

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

  const joinRoom = async (gameName, gameId, playerId) => {
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

  const leaveRoom = async (gameName, gameId) => {
    const room = playerRooms.find((room) => room.gameId === gameId);
    await connection.leave(gameId, room.playerCredentials, playerName);

    setPlayerRooms(playerRooms.filter((room) => room.gameId !== gameId));
  };

  const createRoom = async (gameName, numPlayers) => {
    await connection.create(gameName, numPlayers);
  };

  const exitLobby = async () => {
    await connection.disconnect(rooms, playerRooms, playerName);
    setError('');
    logout();
  };

  const startGame = (gameName, { gameID }) => {
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
      gameId: gameID,
    };
    setRunningGame(game);
  };

  const useRefreshLobby = (refreshInterval) => {
    useEffect(() => {
      catchErrors(connection.refresh());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lobbyServer, gameComponents]);

    useInterval(() => {
      catchErrors(connection.refresh());
    }, refreshInterval);
  };

  return (
    <LobbyContext.Provider
      value={{
        useRefreshLobby,
        gameComponents,
        lobbyServer,
        joinRoom: catchErrors(joinRoom),
        leaveGame: catchErrors(leaveGame),
        leaveRoom: catchErrors(leaveRoom),
        createRoom: catchErrors(createRoom),
        exitLobby: catchErrors(exitLobby),
        rooms,
        startGame,
        playerRooms,
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
