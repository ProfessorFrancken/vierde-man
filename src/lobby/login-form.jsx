/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'Components/Modal';

class LobbyLoginForm extends React.Component {
  static propTypes = {
    playerName: PropTypes.string,
    onEnter: PropTypes.func.isRequired
  };
  static defaultProps = {
    playerName: ''
  };

  state = {
    playerName: this.props.playerName,
    nameErrorMsg: ''
  };

  render() {
    return (
      <div className="container my-5">
        <Modal.Dialog style={{}}>
          <Modal.Header>
            <Modal.Title>Choose a player name: </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <input
                type="text"
                value={this.state.playerName}
                onChange={this.onChangePlayerName}
                onKeyPress={this.onKeyPress}
                className="form-control"
              />

              {this.state.nameErrorMsg && (
                <div className="invalid-feedback">
                  {this.state.nameErrorMsg}
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Actions>
              <Modal.Action onClick={this.onClickEnter}>Enter</Modal.Action>
            </Modal.Actions>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    );
  }

  onClickEnter = () => {
    if (this.state.playerName === '') return;
    this.props.onEnter(this.state.playerName);
  };

  onKeyPress = event => {
    if (event.key === 'Enter') {
      this.onClickEnter();
    }
  };

  onChangePlayerName = event => {
    const name = event.target.value.trim();
    this.setState({
      playerName: name,
      nameErrorMsg: name.length > 0 ? '' : 'empty player name'
    });
  };
}

export default LobbyLoginForm;
