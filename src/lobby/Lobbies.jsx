import React, { useState } from 'react';
import Modal from 'Components/Modal';
import LobbyRoomInstance from './room-instance';
import LobbyCreateRoomForm from './create-room-form';
import { subDays, fromUnixTime } from 'date-fns';

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
    <div className="container">
      <Modal.Dialog>
        <Modal.Header>
          <div className="d-flex justify-content-between">
            <Modal.Title>{playerName}, hoi</Modal.Title>
            <button
              className="btn btn-text text-muted bg-light"
              onClick={exitLobby}
            >
              Change username
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-primary">
            Want to chat while playing a boompje? Join the{' '}
            <a
              href="https://discord.gg/gHb2jUq"
              className="font-weight-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              unofficial Francken Discord
            </a>
            .
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-0">Join a room, or open a new room.</p>
              <div className="form-group form-check mt-2 text-muted">
                <label htmlFor="showOldRooms">
                  <input
                    className="form-check-input"
                    onChange={onChange}
                    checked={showOldRooms}
                    type="checkbox"
                    id="showOldRooms"
                  />
                  Show outdated rooms
                </label>
              </div>
            </div>
            <LobbyCreateRoomForm
              games={gameComponents}
              createGame={createRoom}
            />
          </div>
        </Modal.Body>
        <Modal.Table className="border-bottom table-responsive ">
          <table className="table mb-0">
            <thead>
              <tr>
                <th className="text-center">Wij</th>
                <th className="text-center bg-light">Zij</th>
                <th className="text-center">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms
                .filter(showOldRoomsFilter(showOldRooms))
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
        </Modal.Table>
        {errorMsg && (
          <Modal.Body>
            <div className="alert alert-danger">{errorMsg}</div>
          </Modal.Body>
        )}
      </Modal.Dialog>
    </div>
  );
};

export default Lobbies;
