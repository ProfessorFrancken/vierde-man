const handleResponse = (response) => {
  if (response.status !== 200) {
    throw new Error('HTTP status ' + response.status);
  }
  return response.json();
};

class LobbyConnection {
  constructor(server) {
    this.server = server;
  }

  _baseUrl() {
    return `${this.server || ''}/games`;
  }

  async refresh(gameComponents) {
    try {
      const gameIsSupported = (gameName) =>
        gameComponents.some(({ game: { name } }) => name === gameName);

      const games = await fetch(this._baseUrl())
        .then(handleResponse)
        .then((games) => games.filter(gameIsSupported));

      const roomsPerGame = await games.map(async (gameName) => {
        const addGameNameToRoom = (room) => ({ ...room, gameName });
        return await fetch(this._baseUrl() + '/' + gameName)
          .then(handleResponse)
          .then(({ rooms }) => rooms.map(addGameNameToRoom));
      });

      return await Promise.all(roomsPerGame);
    } catch (error) {
      throw new Error('failed to retrieve list of games (' + error + ')');
    }
  }

  async join(roomToJoin, gameID, playerID, playerName) {
    try {
      const response = await fetch(
        this._baseUrl() +
          '/' +
          roomToJoin.gameName +
          '/' +
          roomToJoin.gameID +
          '/join',
        {
          method: 'POST',
          body: JSON.stringify({
            playerID: playerID,
            playerName,
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      ).then(handleResponse);

      return response.playerCredentials;
    } catch (error) {
      throw new Error('failed to join room ' + gameID + ' (' + error + ')');
    }
  }

  async leave(room, { credentials, playerName }) {
    const gameID = room.gameID;
    console.log('Leave', { room, gameID, credentials, playerName });
    try {
      const playerRemovedFromGame = room.players
        .filter(({ name }) => name === playerName)
        .map(
          async (player) =>
            await fetch(
              this._baseUrl() + '/' + room.gameName + '/' + gameID + '/leave',
              {
                method: 'POST',
                body: JSON.stringify({
                  playerID: player.id,
                  credentials,
                }),
                headers: { 'Content-Type': 'application/json' },
              }
            )
              .then(handleResponse)
              .then(() => player.name)
        );

      return await Promise.all(playerRemovedFromGame);
    } catch (error) {
      throw new Error('failed to leave room ' + gameID + ' (' + error + ')');
    }
  }

  async create(gameComponent, { numPlayers, maxRounds }) {
    const gameName = gameComponent.game.name;
    console.log('connection', numPlayers, maxRounds);
    try {
      if (!gameComponent) {
        throw new Error('game not found');
      }
      if (
        numPlayers < gameComponent.game.minPlayers ||
        numPlayers > gameComponent.game.maxPlayers
      ) {
        throw new Error('invalid number of players ' + numPlayers);
      }
      const response = await fetch(
        this._baseUrl() + '/' + gameName + '/create',
        {
          method: 'POST',
          body: JSON.stringify({
            numPlayers: numPlayers,
            setupData: {
              roomName: 'T.F.V. Ole',
              maxRounds,
            },
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      ).then(handleResponse);

      const room = {
        gameID: response.gameID,
        players: [...Array(numPlayers).keys()].map((id) => ({ id })),
        gameName,
        wij: 0,
        zij: 0,
        rounds: 0,
        turn: 1,
        currentPlayer: 0,
        createdAt: Date.now(),
        phase: '',
      };

      return room;
    } catch (error) {
      throw new Error(
        'failed to create room for ' + gameName + ' (' + error + ')'
      );
    }
  }
}

export default LobbyConnection;
