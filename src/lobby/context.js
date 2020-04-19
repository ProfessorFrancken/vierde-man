import React, { useState, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { useAuth } from 'auth/context';
import { useError } from 'Context';
import { SocketIO } from 'boardgame.io/multiplayer';
import { LobbyConnection } from './connection';
import { useInterval } from 'hooks';
import _ from 'lodash';

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

    const addPlayerToRoom = (room) => ({
      ...room,
      players:
        room.gameID !== gameId
          ? room.players
          : room.players.map((player) =>
              player.id === Number.parseInt(playerId, 10)
                ? { ...player, name: playerName }
                : player
            ),
    });

    setRooms(rooms.map(addPlayerToRoom));

    setPlayerRooms([
      ...playerRooms,
      { playerId, gameId, gameName, playerCredentials },
    ]);
  };
  const leaveGame = (gameId) => {};

  const leaveRoom = async (gameName, gameId) => {
    const room = playerRooms.find((room) => room.gameId === gameId);
    const playerNames = await connection.leave(
      gameId,
      room.playerCredentials,
      playerName
    );

    const removeRoomIfEmpty = (room) =>
      room.gameID !== gameId ||
      room.players.filter((player) => player.name).length > 0;

    const removePlayerFromRoom = (players) => (room) => ({
      ...room,
      players:
        room.gameID !== gameId
          ? room.players
          : room.players.map(({ name, ...player }) =>
              players.includes(name) ? player : { ...player, name }
            ),
    });

    setRooms(
      rooms.map(removePlayerFromRoom(playerNames)).filter(removeRoomIfEmpty)
    );
    setPlayerRooms(playerRooms.filter((room) => room.gameId !== gameId));
  };

  const createRoom = async (gameName, numPlayers) => {
    const room = await connection.create(gameName, numPlayers);

    console.log('Created the room', { room });
    setRooms([room, ...rooms]);
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

  const refresh = catchErrors(async () => {
    const roomsPerGame = await connection.refresh(gameComponents);

    setRooms(_.sortBy(roomsPerGame.flat(), ({ createdAt }) => -createdAt));
  });

  const useRefreshLobby = (refreshInterval) => {
    useEffect(() => {
      refresh();
    }, []);
    useInterval(refresh, refreshInterval);
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
