import React, { useState } from 'react';
import Modal from 'Components/Modal';
import { useAuth } from 'auth/context';
import { Redirect } from 'react-router-dom';
import { ReactComponent as Francken } from 'assets/LOGO_KAAL.svg';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  faUserSecret,
  faUser,
  faSignInAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const franckenAccountIsEnabled = false;

const FranckenLogo = styled.div`
  fill: ${({ theme }) => theme.primary} !important;
  * {
    fill: ${({ theme }) => theme.primary} !important;
  }
`;

const GuestLoginForm = ({ displayName, onChangeDisplayName, onSubmit }) => {
  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="form-group">
      <label for="displayName">Display name</label>
      <input
        id="displayName"
        type="text"
        value={displayName}
        onChange={onChangeDisplayName}
        onKeyPress={onKeyPress}
        className="form-control"
        placeholder="Jan Francken"
      />

      <small class="form-text text-muted">
        A guest account can be converted to an account by claiming its display
        name. Claiming a display name will allow you to keep all data &
        statistics from previously played games.
      </small>
    </div>
  );
};

const AccountLoginForm = ({ onSubmit, nameErrorMsg }) => {
  const [email, setEmail] = useState('');
  const [passphrase, setPassphrase] = useState('');

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  const onChangeEmail = (event) => {
    const name = event.target.value;
    setEmail(name);
  };

  const onChangePassphrase = (event) => {
    const name = event.target.value;
    setPassphrase(name);
  };

  return (
    <>
      <div className="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={onChangeEmail}
          onKeyPress={onKeyPress}
          className="form-control"
          placeholder="email@example.com"
        />

        {nameErrorMsg && <div className="invalid-feedback">{nameErrorMsg}</div>}
      </div>
      <div className="form-group">
        <label for="passphrase">Passphrase</label>
        <input
          id="passphrase"
          type="password"
          value={passphrase}
          onChange={onChangePassphrase}
          onKeyPress={onKeyPress}
          className="form-control"
          placeholder="We don't do any validation on your passphrase, so this can be a long sentence"
        />
        <small class="form-text text-muted">
          We currently don't have an option to reset your passphrase. If you've
          forgotton your passphrase send a message to Mark to have it be reset.
        </small>
      </div>
      <small class="form-text text-muted">
        Don't have an account?{' '}
        <Link to="/login">Login with a guest account</Link>.
      </small>
    </>
  );
};

const Login = () => {
  const { username, login } = useAuth();
  const [signInAsGuest, setSignInAsGuest] = useState(true);
  const [displayName, setDisplayName] = useState(username || '');
  const [nameErrorMsg, setNameErrorMsg] = useState();

  if (username !== undefined) {
    return <Redirect to="/lobby" />;
  }

  const onLogin = ({ displayName, email, password }) => {
    if (displayName !== undefined) {
    }

    if (email !== undefined && password !== undefined) {
    }
  };

  const onClickEnter = () => {
    if (displayName === '') {
      return;
    }
    login(displayName.trim());
  };

  const onSubmit = (event) => {
    if (event.key === 'Enter') {
      onClickEnter();
    }
  };

  const onChangeDisplayName = (event) => {
    const name = event.target.value;
    setDisplayName(name);
    setNameErrorMsg(name.length > 0 ? '' : 'empty player name');
  };

  return (
    <div className="container-fluid">
      <h1 className="d-flex justify-content-between">Login</h1>
      <hr />

      <div className="container mt-5">
        <div style={{ maxWidth: '30em' }} className="mx-auto">
          <Modal.Dialog>
            <Modal.Footer>
              <Modal.Actions>
                <Modal.Action
                  primary={signInAsGuest === true}
                  onClick={() => setSignInAsGuest(true)}
                >
                  <FontAwesomeIcon
                    icon={faUserSecret}
                    className="text-muted mr-3"
                    fixedWidth
                  />
                  Guest account
                </Modal.Action>
                <Modal.Action
                  primary={signInAsGuest === false}
                  onClick={() => setSignInAsGuest(false)}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-muted mr-3"
                    fixedWidth
                  />
                  Login
                </Modal.Action>
                {franckenAccountIsEnabled && (
                  <Modal.Action onClick={onClickEnter}>
                    <div className="d-flex justify-content-center align-items-center">
                      <FranckenLogo>
                        <Francken
                          height="40px"
                          style={{ fill: 'blue !important' }}
                        />
                      </FranckenLogo>
                      <span className="ml-3">Francken Account</span>
                    </div>
                  </Modal.Action>
                )}
              </Modal.Actions>
            </Modal.Footer>
            <Modal.Body>
              {signInAsGuest ? (
                <GuestLoginForm
                  displayName={displayName}
                  onChangeDisplayName={onChangeDisplayName}
                  onSubmit={onSubmit}
                />
              ) : (
                <AccountLoginForm
                  displayName={displayName}
                  onChangeDisplayName={onChangeDisplayName}
                  onSubmit={onSubmit}
                />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Modal.Actions>
                <Modal.Action onClick={onClickEnter}>
                  <FontAwesomeIcon
                    icon={faSignInAlt}
                    className="text-muted mr-3"
                    fixedWidth
                  />
                  Login
                </Modal.Action>
              </Modal.Actions>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      </div>
    </div>
  );
};

export default Login;
