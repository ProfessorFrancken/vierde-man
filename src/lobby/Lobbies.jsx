import React from 'react';
import Modal from 'Components/Modal';
import LobbyRoomInstance from './room-instance';
import LobbyCreateRoomForm from './create-room-form';

const Lobbies = ({
  playerName,
  gameComponents,
  errorMsg,
  exitLobby,
  createRoom,
  joinRoom,
  leaveRoom,
  startGame,
  rooms,
}) => {
  return (
    <div className="container">
      <Modal.Dialog>
        <Modal.Header>
          <div className="d-flex justify-content-between">
            <Modal.Title> Welcome, {playerName} </Modal.Title>
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
            >
              unofficial Francken Discord
            </a>
            .
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0">Join a room, or open a new room.</p>
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
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => {
                const { gameID, gameName, players } = room;
                return (
                  <LobbyRoomInstance
                    key={'instance-' + gameID}
                    room={{
                      gameID,
                      gameName,
                      players: Object.values(players),
                    }}
                    playerName={playerName}
                    onClickJoin={joinRoom}
                    onClickLeave={leaveRoom}
                    onClickPlay={startGame}
                  />
                );
              })}
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
