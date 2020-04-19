import React from 'react';
import useLocalStorageState from 'use-local-storage-state';

const AuthContext = React.createContext();

const localStorageKey = '__vierde_man_auth__';

function AuthProvider(props) {
  const [auth, setAuth] = useLocalStorageState(localStorageKey, {
    username: undefined,
    token: undefined,
  });

  // Currently the login acts like a register because we only have guest users
  const login = (username) => {
    setAuth({ username, token: undefined });
  };
  const logout = () => {
    setAuth({ username: undefined, token: undefined });
  };

  return (
    <AuthContext.Provider
      value={{ username: auth.username, login, logout }}
      {...props}
    />
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

export { AuthProvider, useAuth };
