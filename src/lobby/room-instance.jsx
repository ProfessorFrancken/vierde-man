/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const PlayButton = ({ gameID, gameName, onClick, seatId }) => (
  <button onClick={onClick} className="btn btn-primary">
    Play
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

  render() {
    const room = this.props.room;
    const freeSeat = room.players.find(player => !player.name);
    const playerSeat = room.players.find(
      player => player.name === this.props.playerName
    );

    const PlayerTd = ({ room, player, playerSeat }) => (
      <td>
        {player.name ? (
          playerSeat && playerSeat.id === player.id ? (
            <button
              className={`btn btn-text ${playerSeat ? 'text-white' : ''}`}
              onClick={() =>
                this.props.onClickLeave(room.gameName, room.gameID)
              }
              title="Leave room"
            >
              <span className="text-white">{player.name}</span>

              <FontAwesomeIcon icon={faTimes} className="ml-2" />
            </button>
          ) : (
            <button
              className={`btn btn-text ${playerSeat ? 'text-white' : ''}`}
            >
              {player.name}
            </button>
          )
        ) : playerSeat ? (
          <button class="btn btn-text">Waiting for plyaer</button>
        ) : (
          <button
            className="btn btn-text text-primary"
            onClick={() =>
              this.props.onClickJoin(room.gameName, room.gameID, '' + player.id)
            }
          >
            Join
          </button>
        )}
      </td>
    );

    return (
      <tr className={playerSeat ? 'bg-success text-white' : ''}>
        {room.players
          .filter(({ id }) => [0, 2].includes(id))
          .map(player => (
            <PlayerTd
              key={`player-${player.id}`}
              room={room}
              player={player}
              playerSeat={playerSeat}
            />
          ))}
        {room.players
          .filter(({ id }) => [1, 3].includes(id))
          .map(player => (
            <PlayerTd
              key={`player-${player.id}`}
              room={room}
              player={player}
              playerSeat={playerSeat}
            />
          ))}
        <td
          key={`cell-buttons-${room.gameID}`}
          className="d-flex justify-content-between"
        >
          {playerSeat && freeSeat && (
            <button className="btn btn-text" disabled>
              Waiting for players to join
            </button>
          )}
          {playerSeat && !freeSeat && (
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
          {!playerSeat && !freeSeat && (
            <button
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
        </td>
      </tr>
    );
  }
}

export default LobbyRoomInstance;
