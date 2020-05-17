import React, { useState } from 'react';
import LobbyRoomInstance from './room-instance';
import LobbyCreateRoomForm from './create-room-form';
import { subDays, fromUnixTime } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

const joinableRoom = (playerName) => ({ rounds, players, ...rest }) => {
  if (rounds === 16) {
    return false;
  }

  return _.some(
    players,
    (player) => !player.name || player.name === playerName
  );
};
const showOldRoomsFilter = (showOldRooms) => ({ createdAt }) => {
  if (showOldRooms) {
    return true;
  }
  if (!createdAt) {
    return false;
  }

  const twoDaysAgo = subDays(Date.now(), 2);

  return twoDaysAgo < fromUnixTime(createdAt / 1000);
};

const SpectatableRooms = ({
  spectatableRooms,
  playerName,
  onClickJoin,
  onClickLeave,
}) => {
  if (spectatableRooms.length === 0) {
    return null;
  }

  return (
    <tbody>
      <tr className="bg-light text-muted">
        <td colspan="7">
          <FontAwesomeIcon icon={faEye} className="mx-2" />
          Spectate games
        </td>
      </tr>
      {spectatableRooms.map((room) => (
        <LobbyRoomInstance
          key={'spectatable-' + room.gameID}
          room={room}
          playerName={playerName}
          onClickJoin={onClickJoin}
          onClickLeave={onClickLeave}
        />
      ))}
    </tbody>
  );
};

const JoinableRooms = ({
  joinableRooms,
  playerName,
  onClickJoin,
  onClickLeave,
}) => {
  return (
    <tbody>
      {joinableRooms.length === 0 ? (
        <tr className="bg-light text-muted">
          <td colSpan="7" className="p-3">
            Open a new room to start a game
          </td>
        </tr>
      ) : (
        joinableRooms.map((room) => (
          <LobbyRoomInstance
            key={'joinable-' + room.gameID}
            room={room}
            playerName={playerName}
            onClickJoin={onClickJoin}
            onClickLeave={onClickLeave}
          />
        ))
      )}
    </tbody>
  );
};

const Lobbies = ({
  playerName,
  gameComponents,
  errorMsg,
  createRoom,
  joinRoom,
  leaveRoom,
  rooms,
}) => {
  const [showOldRooms, setShowOldRooms] = useState(false);
  const toggleShowOldRooms = () => setShowOldRooms(!showOldRooms);

  const [joinableRooms, spectatableRooms] = _.partition(
    rooms.filter(showOldRoomsFilter(showOldRooms)),
    joinableRoom(playerName)
  );
  return (
    <>
      <div className="container-fluid">
        <h1>Vierdeman?</h1>
        <div className="d-flex align-items-center my-2 mt-3">
          <button
            className="mr-3 btn btn-text bg-light"
            onClick={toggleShowOldRooms}
          >
            <FontAwesomeIcon
              icon={showOldRooms ? faEyeSlash : faEye}
              className="mr-2 text-muted"
            />
            {showOldRooms ? 'Hide old rooms' : 'Show old rooms'}
          </button>

          <LobbyCreateRoomForm games={gameComponents} createGame={createRoom} />
        </div>

        <div className="border bg-white mt-3">
          <div>
            <table className="table mb-0">
              <thead>
                <tr>
                  <th colSpan="2" className="text-center">
                    Wij
                  </th>
                  <th colSpan="2" className="text-center bg-light">
                    Zij
                  </th>
                  <th className="text-center">Rounds</th>
                  <th className="text-center">Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <JoinableRooms
                joinableRooms={joinableRooms}
                playerName={playerName}
                onClickJoin={joinRoom}
                onClickLeave={leaveRoom}
              />
              <SpectatableRooms
                spectatableRooms={spectatableRooms}
                playerName={playerName}
                onClickJoin={joinRoom}
                onClickLeave={leaveRoom}
              />
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lobbies;
