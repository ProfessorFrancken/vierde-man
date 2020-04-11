import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'Components/Modal';

const Login = (props) => {
  const onEnter = props.onEnter;
  const [playerName, setPlayerName] = useState(props.playerName || '');
  const [nameErrorMsg, setNameErrorMsg] = useState();

  const onClickEnter = () => {
    if (playerName === '') {
      return;
    }
    onEnter(playerName.trim());
  };

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      onClickEnter();
    }
  };

  const onChangePlayerName = (event) => {
    const name = event.target.value;
    setPlayerName(name);
    setNameErrorMsg(name.length > 0 ? '' : 'empty player name');
  };

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
              value={playerName}
              onChange={onChangePlayerName}
              onKeyPress={onKeyPress}
              className="form-control"
            />

            {nameErrorMsg && (
              <div className="invalid-feedback">{nameErrorMsg}</div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Actions>
            <Modal.Action onClick={onClickEnter}>Enter</Modal.Action>
          </Modal.Actions>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
};

Login.propTypes = {
  playerName: PropTypes.string,
  onEnter: PropTypes.func.isRequired,
};

export default Login;
