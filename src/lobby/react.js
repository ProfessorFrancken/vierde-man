import React from 'react';
import PropTypes from 'prop-types';
import Lobbies from './Lobbies';
import Login from 'lobby/login-form';
import { Redirect, useParams } from 'react-router-dom';
import { useError } from 'Context';
import { useAuth } from 'auth/context';
import { useLobby } from 'lobby/context';

const PlayGame = () => {
  const { playerRooms = [], runningGame } = useLobby();
  const { gameId } = useParams();

  if (!runningGame) {
    return <Redirect to="/lobby" />;
  }

  // NOTE: if no room is found, the user is a spectator
  const room = playerRooms.find((room) => room.gameId === gameId) || {
    playerId: undefined,
    playerCredentials: undefined,
  };

  return (
    <runningGame.app
      gameID={gameId}
      playerID={room.playerId}
      credentials={room.playerCredentials}
    />
  );
};

const LobbiesContainer = ({ refreshInterval = 2000 }) => {
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
    startGame,
    runningGame,
  } = useLobby();

  useRefreshLobby(refreshInterval);

  if (playerName === undefined) {
    return <Redirect to="/login" />;
  }

  if (runningGame) {
    return <Redirect to={`games/${runningGame.gameId}`} />;
  }

  return (
    <div id="lobby-view" className="p-2 p-md-5">
      <Lobbies
        playerName={playerName}
        gameComponents={gameComponents}
        errorMsg={error}
        exitLobby={exitLobby}
        createRoom={createRoom}
        joinRoom={joinRoom}
        leaveRoom={leaveRoom}
        startGame={startGame}
        rooms={rooms}
      />
    </div>
  );
};

LobbiesContainer.propTypes = {
  refreshInterval: PropTypes.number,
};

export { Login, PlayGame, LobbiesContainer };
