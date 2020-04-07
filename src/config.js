const config = {
  gameServer: process.env.REACT_APP_GAME_SERVER,
  lobbyServer: process.env.REACT_APP_LOBBY_SERVER,
  public: process.env.REACT_APP_PUBLIC === 'true' || false
};

export default config;
