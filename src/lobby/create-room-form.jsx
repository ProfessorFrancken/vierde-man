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
import { faPlus } from '@fortawesome/free-solid-svg-icons';

class LobbyCreateRoomForm extends React.Component {
  static propTypes = {
    games: PropTypes.array.isRequired,
    createGame: PropTypes.func.isRequired
  };

  render() {
    const numPlayers = 4;
    const game = this.props.games[0].game.name;
    const createGame = () => {
      this.props.createGame(game, numPlayers);
    };

    return (
      <button
        onClick={createGame}
        className="btn btn-text bg-light text-primary"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Open a new room
      </button>
    );
  }
}

export default LobbyCreateRoomForm;
