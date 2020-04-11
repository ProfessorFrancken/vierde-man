import React from 'react';
import { AuthProvider } from 'auth/context';
import { LobbyProvider } from 'lobby/context';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './global';
import { theme } from './theme';

const ErrorContext = React.createContext();
function ErrorProvider(props) {
  const [error, setError] = React.useState();

  // TODO: possibly wrap in a try catch, and add the error?
  return <ErrorContext.Provider value={{ error, setError }} {...props} />;
}

export function useError() {
  const context = React.useContext(ErrorContext);
  if (context === undefined) {
    throw new Error(`useError must be used within a ErrorProvider`);
  }
  return context;
}

function AppProviders({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ErrorProvider>
        <AuthProvider>
          <LobbyProvider>{children}</LobbyProvider>
        </AuthProvider>
      </ErrorProvider>
    </ThemeProvider>
  );
}
export default AppProviders;
