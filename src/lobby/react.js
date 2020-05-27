import React from 'react';
import PropTypes from 'prop-types';
import Lobbies from './Lobbies';
import Login from 'lobby/login-form';
import { Redirect, useParams } from 'react-router-dom';
import { useError } from 'Context';
import { useAuth } from 'auth/context';
import { useLobby } from 'lobby/context';

const PlayGame = () => {
  const { playerRooms = [], gameClientFactory } = useLobby();
  const { gameName, gameId } = useParams();

  // NOTE: if no room is found, the user is a spectator
  const room = playerRooms.find((room) => room.gameId === gameId) || {
    playerId: undefined,
    playerCredentials: undefined,
  };

  const App = gameClientFactory(gameName, gameId);

  return (
    <App
      gameID={gameId}
      playerID={room.playerId}
      credentials={room.playerCredentials}
    />
  );
};

const LobbiesContainer = ({ refreshInterval = 5000 }) => {
  const { error } = useError();
  const { username: playerName } = useAuth();
  const {
    useRefreshLobby,
    gameComponents,
    joinRoom,
    leaveRoom,
    createRoom,
    exitLobby,
    rooms,
  } = useLobby();

  useRefreshLobby(refreshInterval);

  if (playerName === undefined) {
    return <Redirect to="/login" />;
  }

  return (
    <div id="lobby-view" className="">
      <Lobbies
        playerName={playerName}
        gameComponents={gameComponents}
        errorMsg={error}
        exitLobby={exitLobby}
        createRoom={createRoom}
        joinRoom={joinRoom}
        leaveRoom={leaveRoom}
        rooms={rooms}
      />
    </div>
  );
};

LobbiesContainer.propTypes = {
  refreshInterval: PropTypes.number,
};

export { Login, PlayGame, LobbiesContainer };
