import React from 'react';

const AuthContext = React.createContext();

const localStorageKey = '__vierde_man_username__';

function AuthProvider(props) {
  const [username, setUsername] = React.useState(() => {
    return window.localStorage.getItem(localStorageKey) || undefined;
  });

  // Currently the login acts like a register because we only have guest users
  const login = (username) => {
    window.localStorage.setItem(localStorageKey, username);
    setUsername(username);
  };
  const logout = () => {
    window.localStorage.removeItem(localStorageKey);
    setUsername(undefined);
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }} {...props} />
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
