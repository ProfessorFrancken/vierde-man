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
import { faTimes, faRocket, faEye } from '@fortawesome/free-solid-svg-icons';

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
    const props = this.props;
    const room = props.room;
    const freeSeat = room.players.find(player => !player.name);
    const playerSeat = room.players.find(
      player => player.name === props.playerName
    );

    const PlayerTd = ({ room, player, playerSeat, className }) => (
      <td className={className}>
        {player.name ? (
          playerSeat && playerSeat.id === player.id ? (
            <button
              className={`btn btn-text ${playerSeat ? 'text-white' : ''}`}
            >
              {player.name}
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
              props.onClickJoin(room.gameName, room.gameID, '' + player.id)
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
              className={playerSeat ? 'bg-success' : 'bg-light'}
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
            <button
              onClick={() =>
                props.onClickPlay(room.gameName, {
                  gameID: room.gameID,
                  playerID: '' + playerSeat.id,
                  numPlayers: 4
                })
              }
              className="btn btn-text text-white"
            >
              <FontAwesomeIcon icon={faRocket} className="mr-2" />
              Play
            </button>
          )}
          {!playerSeat && !freeSeat && (
            <button
              onClick={() =>
                props.onClickPlay(room.gameName, {
                  gameID: room.gameID,
                  numPlayers: room.players.length
                })
              }
              className="btn btn-text bg-secondary text-white"
            >
              <FontAwesomeIcon icon={faEye} className="mr-2" />
              Spectate
            </button>
          )}

          {playerSeat && (
            <button
              className={`btn btn-text ${playerSeat ? 'text-white' : ''}`}
              onClick={() => props.onClickLeave(room.gameName, room.gameID)}
              title="Leave room"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Leave
            </button>
          )}
        </td>
      </tr>
    );
  }
}

export default LobbyRoomInstance;
