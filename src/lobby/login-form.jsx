import React, { useState } from 'react';
import Modal from 'Components/Modal';
import { useAuth } from 'auth/context';
import { Redirect } from 'react-router-dom';

const Login = () => {
  const { username, login } = useAuth();
  const [playerName, setPlayerName] = useState(username || '');
  const [nameErrorMsg, setNameErrorMsg] = useState();

  if (username !== undefined) {
    return <Redirect to="/lobby" />;
  }

  const onClickEnter = () => {
    if (playerName === '') {
      return;
    }
    login(playerName.trim());
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

export default Login;
