/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCog } from '@fortawesome/free-solid-svg-icons';

const LobbyCreateRoomForm = (props) => {
  const [maxRounds, setMaxRounds] = useState(16);
  const [changeGameSettings, setChangeGameSettings] = useState(false);
  const numPlayers = 4;
  const game = props.games[0].game.name;
  const createGame = () => {
    props.createGame(game, {
      numPlayers,
      maxRounds,
    });
  };

  const selectRound = (event) => setMaxRounds(event.target.value);

  return (
    <div>
      <button
        onClick={createGame}
        className="btn btn-text bg-light text-primary"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2 text-muted" />
        Open a new room
      </button>
      {changeGameSettings ? (
        <div className="mt-2">
          <div className="form-group">
            <label htmlFor="max-rounds">Max rounds</label>
            <select
              className="form-control"
              id="max-rounds"
              value={maxRounds}
              onChange={selectRound}
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
            </select>
          </div>
        </div>
      ) : (
        <button
          className="btn btn-text btn-sm ml-2"
          onClick={() => setChangeGameSettings(true)}
        >
          <FontAwesomeIcon icon={faCog} className="mr-1 text-muted" />
          Change room settings
        </button>
      )}
    </div>
  );
};
LobbyCreateRoomForm.propTypes = {
  games: PropTypes.array.isRequired,
  createGame: PropTypes.func.isRequired,
};

export default LobbyCreateRoomForm;
