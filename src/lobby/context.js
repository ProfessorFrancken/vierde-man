import React from 'react';
import { useAuth } from 'auth/context';

// provide actions:
// leave room
// join room
// create room
// start gameimport React from 'react'

const LobbyContext = React.createContext();

const localStorageCredentialsKey = '__vierde_man_credentials__';

function LobbyProvider(props) {
  const { logout: authLogout } = useAuth();

  const [credentials, setCredentials] = React.useState(() => {
    const storedCredentials = window.localStorage.getItem(
      localStorageCredentialsKey
    );

    return JSON.parse(storedCredentials) || undefined;
  });

  const logout = () => {
    authLogout();
    window.localStorage.removeItem(localStorageCredentialsKey);
    setCredentials(undefined);
  };

  const joinGame = (gameId, gameName, playerId, credentials) => {
    window.localStorage.setItem(
      localStorageCredentialsKey,
      JSON.stringify({
        credentials,
        playerId,
        gameId,
        gameName,
      })
    );
    setCredentials({
      credentials,
      playerId,
      gameId,
      gameName,
    });
  };
  const leaveGame = (gameId) => {
    window.localStorage.setItem(
      localStorageCredentialsKey,
      JSON.stringify({
        credentials: undefined,
        playerId: undefined,
        gameId: undefined,
        gameName: undefined,
      })
    );
    setCredentials(undefined);
  };

  return (
    <LobbyContext.Provider
      value={{ credentials, logout, joinGame, leaveGame }}
      {...props}
    />
  );
}

function useLobby() {
  const context = React.useContext(LobbyContext);
  if (context === undefined) {
    throw new Error(`useLobby must be used within a LobbyProvider`);
  }
  return context;
}

export { LobbyProvider, useLobby };
