/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

const findPlayersRoom = (rooms, playerName) =>
  rooms.find((room) =>
    room.players.some((player) => player.name === playerName)
  );

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
      const resp = await fetch(this._baseUrl());
      if (resp.status !== 200) {
        throw new Error('HTTP status ' + resp.status);
      }
      const gameIsSupported = (gameName) =>
        this.gameComponents.some(({ game: { name } }) => name === gameName);

      const games = await resp.json();
      const roomsPerGame = await games
        .filter(gameIsSupported)
        .map(async (gameName) => {
          const gameResp = await fetch(this._baseUrl() + '/' + gameName);
          const gameJson = await gameResp.json();
          return gameJson.rooms.map((room) => ({ ...room, gameName }));
        });

      Promise.all(roomsPerGame).then((rooms) => {
        this.setRooms(rooms.flat());
      });
    } catch (error) {
      throw new Error('failed to retrieve list of games (' + error + ')');
    }
  }

  async join(gameName, gameID, playerID, playerName) {
    try {
      const playersCurrentRoom = findPlayersRoom(this.rooms, playerName);
      if (playersCurrentRoom) {
        throw new Error(
          'player has already joined ' + playersCurrentRoom.gameID
        );
      }
      const roomToJoin = this.rooms.find((room) => room.gameID === gameID);
      if (!roomToJoin) {
        throw new Error('game instance ' + gameID + ' not found');
      }
      const resp = await fetch(
        this._baseUrl() + '/' + gameName + '/' + gameID + '/join',
        {
          method: 'POST',
          body: JSON.stringify({
            playerID: playerID,
            playerName,
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (resp.status !== 200) throw new Error('HTTP status ' + resp.status);
      const json = await resp.json();
      roomToJoin.players[Number.parseInt(playerID)].name = playerName;
      return json.playerCredentials;
    } catch (error) {
      throw new Error('failed to join room ' + gameID + ' (' + error + ')');
    }
  }

  async leave(gameName, gameID, credentials, playerName) {
    try {
      let room = this.rooms.find((room) => room.gameID === gameID);
      if (!room) {
        throw new Error('game instance not found');
      }
      for (let player of room.players) {
        if (player.name === playerName) {
          const resp = await fetch(
            this._baseUrl() + '/' + gameName + '/' + gameID + '/leave',
            {
              method: 'POST',
              body: JSON.stringify({
                playerID: player.id,
                credentials,
              }),
              headers: { 'Content-Type': 'application/json' },
            }
          );
          if (resp.status !== 200) {
            throw new Error('HTTP status ' + resp.status);
          }

          // TODO Replace with setRooms ...
          delete player.name;
          return;
        }
      }
      throw new Error('player not found in room');
    } catch (error) {
      throw new Error('failed to leave room ' + gameID + ' (' + error + ')');
    }
  }

  async disconnect(rooms, credentials, playerName) {
    let room = findPlayersRoom(rooms, playerName);
    if (room) {
      await this.leave(room.gameName, room.gameID, credentials, playerName);
    }
    this.setRooms([]);
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
      const resp = await fetch(this._baseUrl() + '/' + gameName + '/create', {
        method: 'POST',
        body: JSON.stringify({
          numPlayers: numPlayers,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (resp.status !== 200) {
        throw new Error('HTTP status ' + resp.status);
      }
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
 * @param {string}   playerName - The name of the player.
 * @param {string}   playerCredentials - The credentials currently used by the player, if any.
 *
 * Returns:
 *   A JS object that synchronizes the list of running game instances with the server and provides an API to create/join/start instances.
 */
export function LobbyConnection(opts) {
  return new _LobbyConnectionImpl(opts);
}
