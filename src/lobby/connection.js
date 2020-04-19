import _ from 'lodash';

const findRoom = (rooms, gameID) => {
  const room = rooms.find((room) => room.gameID === gameID);
  if (!room) {
    throw new Error('game instance ' + gameID + ' not found');
  }
  return room;
};

const handleResponse = (response) => {
  if (response.status !== 200) {
    throw new Error('HTTP status ' + response.status);
  }
  return response.json();
};

class _LobbyConnectionImpl {
  constructor({ server, gameComponents, rooms, setRooms }) {
    this.gameComponents = gameComponents;
    this.server = server;
    this.rooms = rooms;
    this.setRooms = setRooms;
  }

  _baseUrl() {
    return `${this.server || ''}/games`;
  }

  async refresh() {
    try {
      const gameIsSupported = (gameName) =>
        this.gameComponents.some(({ game: { name } }) => name === gameName);

      const games = await fetch(this._baseUrl())
        .then(handleResponse)
        .then((games) => games.filter(gameIsSupported));

      const roomsPerGame = await games.map(async (gameName) => {
        const addGameNameToRoom = (room) => ({ ...room, gameName });
        return await fetch(this._baseUrl() + '/' + gameName)
          .then(handleResponse)
          .then(({ rooms }) => rooms.map(addGameNameToRoom));
      });

      await Promise.all(roomsPerGame).then((rooms) => {
        this.setRooms(_.sortBy(rooms.flat(), ({ createdAt }) => -createdAt));
      });
    } catch (error) {
      throw new Error('failed to retrieve list of games (' + error + ')');
    }
  }

  async join(gameID, playerID, playerName) {
    try {
      const roomToJoin = findRoom(this.rooms, gameID);

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

      const addPlayerToRoom = (room) => ({
        ...room,
        players:
          room.gameID !== roomToJoin.gameID
            ? room.players
            : room.players.map((player) =>
                player.id !== Number.parseInt(playerID, 10)
                  ? player
                  : { ...player, name: playerName }
              ),
      });
      this.setRooms(this.rooms.map(addPlayerToRoom));

      return response.playerCredentials;
    } catch (error) {
      throw new Error('failed to join room ' + gameID + ' (' + error + ')');
    }
  }

  async leave(gameID, credentials, playerName) {
    try {
      const room = findRoom(this.rooms, gameID);
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

      await Promise.all(playerRemovedFromGame).then((players) => {
        const removeRoomIfEmpty = (room) =>
          room.gameID !== gameID ||
          room.players.filter((player) => player.name).length > 0;

        const removePlayerFromRoom = (room) => ({
          ...room,
          players:
            room.gameID !== gameID
              ? room.players
              : room.players.map(({ name, ...player }) =>
                  players.includes(name) ? player : { ...player, name }
                ),
        });

        this.setRooms(
          this.rooms.map(removePlayerFromRoom).filter(removeRoomIfEmpty)
        );
      });
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

  async create(gameName, numPlayers) {
    try {
      const comp = this.gameComponents.find(
        ({ game: { name } }) => name === gameName
      );
      if (!comp) {
        throw new Error('game not found');
      }
      if (
        numPlayers < comp.game.minPlayers ||
        numPlayers > comp.game.maxPlayers
      ) {
        throw new Error('invalid number of players ' + numPlayers);
      }
      const response = await fetch(
        this._baseUrl() + '/' + gameName + '/create',
        {
          method: 'POST',
          body: JSON.stringify({
            numPlayers: numPlayers,
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      ).then(handleResponse);

      this.setRooms([
        {
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
        },
        ...this.rooms,
      ]);
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
 * @param {function} setRooms
 *
 * Returns:
 *   A JS object that synchronizes the list of running game instances with the server and provides an API to create/join/start instances.
 */
export function LobbyConnection(opts) {
  return new _LobbyConnectionImpl(opts);
}
