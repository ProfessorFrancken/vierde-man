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

  const joinRoom = async (connection, gameName, gameId, playerId) => {
    try {
      const playerCredentials = await connection.join(
        gameName,
        gameId,
        playerId,
        playerName
      );

      setPlayerRooms([
        ...playerRooms,
        { playerId, gameId, gameName, playerCredentials },
      ]);
    } catch (error) {
      setError(error.message);
    }
  };
  const leaveGame = (gameId) => {};

  const leaveRoom = async (connection, gameName, gameId) => {
    try {
      const room = playerRooms.find((room) => room.gameId === gameId);
      await connection.leave(
        gameName,
        gameId,
        room.playerCredentials,
        playerName
      );

      setPlayerRooms(playerRooms.filter((room) => room.gameId !== gameId));
    } catch (error) {
      setError(error.message);
    }
  };

  const createRoom = async (connection, gameName, numPlayers) => {
    try {
      await connection.create(gameName, numPlayers);
    } catch (error) {
      setError(error.message);
    }
  };

  const exitLobby = async (connection) => {
    try {
      await connection.disconnect(rooms, playerRooms, playerName);
      setError('');
      logout();
    } catch (error) {
      setError(error.message);
    }
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
        joinRoom,
        leaveGame,
        leaveRoom,
        createRoom,
        exitLobby,
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
