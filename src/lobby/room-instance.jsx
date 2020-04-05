/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';

const LeaveButton = ({ gameID, gameName, onClick }) => (
  <button
    key={`button-leave-${gameID}`}
    onClick={onClick}
    className="btn btn-primary"
  >
    Leave
  </button>
);

const PlayButton = ({ gameID, gameName, onClick, seatId }) => (
  <button
    key={`button-play-${gameID}`}
    onClick={onClick}
    className="btn btn-primary"
  >
    Play
  </button>
);

const JoinButton = ({ gameID, gameName, onClick, seatId }) => (
  <button
    key={`button-join-${gameID}`}
    onClick={onClick}
    className="btn btn-primary"
  >
    Join
  </button>
);

class LobbyRoomInstance extends React.Component {
  static propTypes = {
    room: PropTypes.shape({
      gameName: PropTypes.string.isRequired,
      gameID: PropTypes.string.isRequired,
      players: PropTypes.array.isRequired
    }),
    playerName: PropTypes.string.isRequired,
    onClickJoin: PropTypes.func.isRequired,
    onClickLeave: PropTypes.func.isRequired,
    onClickPlay: PropTypes.func.isRequired
  };

  _createInstanceButtons = room => {
    const playerSeat = room.players.find(
      player => player.name === this.props.playerName
    );
    const freeSeat = room.players.find(player => !player.name);

    const canLeave = playerSeat;
    const canJoin = !playerSeat && freeSeat;
    const canPlay = playerSeat && !freeSeat;
    const canSpectate = !playerSeat && !freeSeat;

    return (
      <div>
        {canJoin && (
          <JoinButton
            gameID={room.gameID}
            gameName={room.gameName}
            seatId={freeSeat.id}
            onClick={() =>
              this.props.onClickJoin(
                room.gameName,
                room.gameID,
                '' + freeSeat.id
              )
            }
          />
        )}
        {canPlay && (
          <PlayButton
            gameId={room.gameID}
            gameName={room.gameName}
            seatId={playerSeat.id}
            onClick={() =>
              this.props.onClickPlay(room.gameName, {
                gameID: room.gameID,
                playerID: '' + playerSeat.id,
                numPlayers: 4
              })
            }
          />
        )}
        {canLeave && (
          <LeaveButton
            gameID={room.gameID}
            gameName={room.gameName}
            onClick={() => this.props.onClickLeave(room.gameName, room.gameID)}
          />
        )}
        {canSpectate && (
          <button
            key={`button-spectate-${room.gameID}`}
            onClick={() =>
              this.props.onClickPlay(room.gameName, {
                gameID: room.gameID,
                numPlayers: room.players.length
              })
            }
            className="btn btn-primary"
          >
            Spectate
          </button>
        )}
      </div>
    );

    // already seated: waiting for game to start
    if (playerSeat && freeSeat) {
      return (
        <LeaveButton
          gameID={room.gameID}
          gameName={room.gameName}
          onClick={() => this.props.onClickLeave(room.gameName, room.gameID)}
        />
      );
    }

    // at least 1 seat is available
    if (freeSeat) {
      return (
        <JoinButton
          gameID={room.gameID}
          gameName={room.gameName}
          seatId={freeSeat.id}
          onClick={() =>
            this.props.onClickJoin(room.gameName, room.gameID, '' + freeSeat.id)
          }
        />
      );
    }

    // room is full
    if (playerSeat) {
      return (
        <>
          <PlayButton
            gameId={room.gameID}
            gameName={room.gameName}
            seatId={playerSeat.id}
            onClick={() =>
              this.props.onClickPlay(room.gameName, {
                gameID: room.gameID,
                playerID: '' + playerSeat.id,
                numPlayers: 4
              })
            }
          />
          <LeaveButton
            gameID={room.gameID}
            gameName={room.gameName}
            onClick={() => this.props.onClickLeave(room.gameName, room.gameID)}
          />
        </>
      );
    }

    // Spectate button
    return (
      <button
        key={`button-spectate-${room.gameID}`}
        onClick={() =>
          this.props.onClickPlay(room.gameName, {
            gameID: room.gameID,
            numPlayers: room.players.length
          })
        }
        className="btn btn-primary"
      >
        Spectate
      </button>
    );
  };

  render() {
    const room = this.props.room;
    return (
      <tr key={`line-${room.gameID}`}>
        <td key={`cell-seats-${room.gameID}`}>
          <ul className="list-unstyled d-flex justify-content-between mb-0">
            {room.players.map(player => (
              <li
                className={`p-2 px-3 bg-light rounded ${
                  player.name ? 'text-primary' : 'text-muted'
                }`}
              >
                {player.name ? player.name : 'Free'}
              </li>
            ))}
          </ul>
        </td>
        <td
          key={`cell-buttons-${room.gameID}`}
          className="d-flex justify-content-between"
        >
          {this._createInstanceButtons(room)}
        </td>
      </tr>
    );
  }
}

export default LobbyRoomInstance;
