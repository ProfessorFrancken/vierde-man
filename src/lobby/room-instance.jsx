import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlay, faEye } from '@fortawesome/free-solid-svg-icons';
import { fromUnixTime, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const LobbyRoom = (props) => {
  const room = props.room;
  const freeSeat = room.players.find((player) => !player.name);
  const playerSeat = room.players.find(
    (player) => player.name === props.playerName
  );

  const PlayerTd = ({ room, player, playerSeat, className }) => {
    const activePlayerId = parseInt(room.currentPlayer, 10);
    return (
      <div className={`text-center my-2`}>
        {player.name ? (
          <button
            className={`btn btn-block ${className}
${activePlayerId === player.id ? 'text-primary' : 'text-muted'}
`}
          >
            {player.name}
          </button>
        ) : playerSeat ? (
          <button className="btn btn-block bg-light">Waiting for player</button>
        ) : (
          <button
            className="btn btn-block text-primary border border-primary"
            onClick={() =>
              props.onClickJoin(room.gameName, room.gameID, '' + player.id)
            }
          >
            Join
          </button>
        )}
      </div>
    );
  };

  return (
    <tr className={`${playerSeat && ''} p-2`}>
      {room.players
        .filter(({ id }) => [0, 2].includes(id))
        .map((player, idx) => (
          <td width="15%" key={`player-${player.id}`}>
            <PlayerTd
              key={`player-${player.id}`}
              room={room}
              player={player}
              playerSeat={playerSeat}
              className={'bg-light'}
            />
          </td>
        ))}
      {room.players
        .filter(({ id }) => [1, 3].includes(id))
        .map((player) => (
          <td width="15%" key={`player-${player.id}`}>
            <PlayerTd
              key={`player-${player.id}`}
              room={room}
              player={player}
              playerSeat={playerSeat}
              className={'bg-light'}
            />
          </td>
        ))}
      <td className="align-middle text-center text-muted">
        {room.turn > 1 && <span>{room.roundsPlayed} / 16</span>}
      </td>
      <td className="align-middle text-center text-muted">
        {room.createdAt && (
          <span>
            {formatDistanceToNow(fromUnixTime(room.createdAt / 1000))} ago
          </span>
        )}
      </td>
      <td className="text-right align-middle h-100">
        <div className="d-flex justify-content-end">
          {playerSeat && (
            <div className="my-1">
              <button
                className={`mx-1 btn btn-text bg-primary ${
                  playerSeat ? 'text-white' : ''
                }`}
                onClick={() => props.onClickLeave(room.gameName, room.gameID)}
                title="Leave room"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Leave
              </button>
            </div>
          )}

          {playerSeat && !freeSeat && (
            <div className="my-1">
              <Link
                to={`/games/klaver-jassen/${room.gameID}`}
                className="btn btn-text bg-primary text-white mx-1"
              >
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                Play
              </Link>
            </div>
          )}
          {!playerSeat && !freeSeat && (
            <div className="my-1">
              <Link
                to={`/games/klaver-jassen/${room.gameID}`}
                className="btn btn-text bg-light text-dark mx-1"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Spectate
              </Link>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

LobbyRoom.propTypes = {
  room: PropTypes.shape({
    gameName: PropTypes.string.isRequired,
    gameID: PropTypes.string.isRequired,
    players: PropTypes.array.isRequired,
  }),
  playerName: PropTypes.string.isRequired,
  onClickJoin: PropTypes.func.isRequired,
  onClickLeave: PropTypes.func.isRequired,
};
export default LobbyRoom;
