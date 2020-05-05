import React, { useState } from 'react';
import Modal from 'Components/Modal';
import LobbyRoomInstance from './room-instance';
import LobbyCreateRoomForm from './create-room-form';
import { subDays, fromUnixTime, formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const unfinishedRoom = ({ rounds }) => rounds !== 16;
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

const Lobbies = ({
  playerName,
  gameComponents,
  errorMsg,
  exitLobby,
  createRoom,
  joinRoom,
  leaveRoom,
  rooms,
}) => {
  const [showOldRooms, setShowOldRooms] = useState(false);
  const onChange = () => setShowOldRooms(!showOldRooms);

  return (
    <>
      <div className="container-fluid">
        <h1 className="d-flex justify-content-between">
          Vierdeman?
          <div>
            <LobbyCreateRoomForm
              games={gameComponents}
              createGame={createRoom}
            />

            <button
              className="ml-3 btn btn-text text-muted bg-light"
              onClick={exitLobby}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Change username
            </button>
          </div>
        </h1>
        <hr />

        <div className="border bg-white">
          <div className="d-flex justify-content-between border-bottom">
            <button className="btn btn-block mt-0 bg-white p-3">
              Active games
            </button>
            <button className="btn btn-block mt-0 bg-light p-3">
              Your games
              <span class="badge badge-pill badge-primary ml-2">4</span>
            </button>
            <button className="btn btn-block mt-0 bg-light p-3">
              Previous games
            </button>
          </div>
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
              <tbody>
                {rooms
                  .filter(showOldRoomsFilter(true))
                  .filter(unfinishedRoom)
                  .map((room) => (
                    <LobbyRoomInstance
                      key={'instance-' + room.gameID}
                      room={room}
                      playerName={playerName}
                      onClickJoin={joinRoom}
                      onClickLeave={leaveRoom}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lobbies;
