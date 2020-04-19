const handleResponse = (response) => {
  if (response.status !== 200) {
    throw new Error('HTTP status ' + response.status);
  }
  return response.json();
};

class _LobbyConnectionImpl {
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

  async leave(room, gameID, credentials, playerName) {
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

  async disconnect(rooms, playerRooms, playerName) {
    return Promise.all(
      playerRooms.map(
        async (room) =>
          await this.leave(room.gameId, room.playerCredentials, playerName)
      )
    );
  }

  async create(gameComponent, numPlayers) {
    const gameName = gameComponent.game.name;
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

/**
 * LobbyConnection
 *
 * Lobby model.
 *
 * @param {string}   server - '<host>:<port>' of the server.
 * @param {Array}    gameComponents - A map of Board and Game objects for the supported games.
 * @param {Array}    rooms
 *
 * Returns:
 *   A JS object that synchronizes the list of running game instances with the server and provides an API to create/join/start instances.
 */
export function LobbyConnection(opts) {
  return new _LobbyConnectionImpl(opts);
}
