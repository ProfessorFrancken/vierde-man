import React from 'react';
import { AuthProvider } from 'auth/context';
import { LobbyProvider } from 'lobby/context';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './global';
import { theme } from './theme';

function AppProviders({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <LobbyProvider>{children}</LobbyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default AppProviders;
