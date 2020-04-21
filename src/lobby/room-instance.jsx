import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faRocket, faEye } from '@fortawesome/free-solid-svg-icons';
import { fromUnixTime, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const CurrentPlayerName = ({ room }) => {
  const playerId = parseInt(room.currentPlayer, 10);
  const player = room.players.find(({ id }) => id === playerId);
  return <span>{player.name || `Player ${playerId}`}</span>;
};

const LobbyRoom = (props) => {
  const room = props.room;
  const freeSeat = room.players.find((player) => !player.name);
  const playerSeat = room.players.find(
    (player) => player.name === props.playerName
  );

  const PlayerTd = ({ room, player, playerSeat, className }) => (
    <div className={`text-center my-2`}>
      {player.name ? (
        playerSeat && playerSeat.id === player.id ? (
          <button className={`btn btn-block ${className}`}>
            {player.name}
          </button>
        ) : (
          <button className={`btn btn-block ${className}`}>
            {player.name}
          </button>
        )
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

  return (
    <tr className={`${playerSeat && ''} p-2`}>
      <td width="30%">
        {room.players
          .filter(({ id }) => [0, 2].includes(id))
          .map((player) => (
            <PlayerTd
              key={`player-${player.id}`}
              room={room}
              player={player}
              playerSeat={playerSeat}
              className={'bg-light'}
            />
          ))}
      </td>
      <td width="30%">
        {room.players
          .filter(({ id }) => [1, 3].includes(id))
          .map((player) => (
            <PlayerTd
              key={`player-${player.id}`}
              room={room}
              player={player}
              playerSeat={playerSeat}
              className={'bg-light'}
            />
          ))}
      </td>
      <td className="align-middle">
        <div className="d-flex flex-column justify-content-center align-items-center">
          {room.turn > 1 && (
            <>
              <small className="text-center text-muted mb-2">
                Played <span>{room.roundsPlayed} / 16 rounds</span>
              </small>
              <small className="text-center text-muted my-2">
                Active player: <CurrentPlayerName room={room} />
              </small>
            </>
          )}

          {room.createdAt && (
            <small className="text-center text-muted mt-2">
              created {formatDistanceToNow(fromUnixTime(room.createdAt / 1000))}{' '}
              ago
            </small>
          )}
        </div>
      </td>
      <td className="text-right align-middle h-100">
        <div className="d-flex flex-column justify-content-center">
          {playerSeat && !freeSeat && (
            <div className="my-1">
              <Link
                to={`/games/${room.gameName}/${room.gameID}`}
                className="btn btn-text bg-primary text-white"
              >
                <FontAwesomeIcon icon={faRocket} className="mr-2" />
                Play
              </Link>
            </div>
          )}
          {!playerSeat && !freeSeat && (
            <div className="my-1">
              <Link
                to={`/games/${room.gameName}/${room.gameID}`}
                className="btn btn-text bg-light text-dark"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Spectate
              </Link>
            </div>
          )}

          {room.turn <= 1 && playerSeat && (
            <div className="my-1">
              <button
                className={`ml-1 btn btn-text bg-primary ${
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
