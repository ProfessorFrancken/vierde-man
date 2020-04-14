import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faRocket, faEye } from '@fortawesome/free-solid-svg-icons';

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
      <td
        key={`cell-buttons-${room.gameID}`}
        className="text-right align-middle h-100"
      >
        <div className="d-flex flex-column justify-content-center">
          {playerSeat && !freeSeat && (
            <div className="my-1">
              <button
                onClick={() =>
                  props.onClickPlay(room.gameName, {
                    gameID: room.gameID,
                    playerID: '' + playerSeat.id,
                    numPlayers: 4,
                  })
                }
                className="btn btn-text bg-primary text-white"
              >
                <FontAwesomeIcon icon={faRocket} className="mr-2" />
                Play
              </button>
            </div>
          )}
          {!playerSeat && !freeSeat && (
            <div className="my-1">
              <button
                onClick={() =>
                  props.onClickPlay(room.gameName, {
                    gameID: room.gameID,
                    numPlayers: room.players.length,
                  })
                }
                className="btn btn-text bg-light text-dark"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Spectate
              </button>
            </div>
          )}

          {playerSeat && (
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
  onClickPlay: PropTypes.func.isRequired,
};
export default LobbyRoom;
