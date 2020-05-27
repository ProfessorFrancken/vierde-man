import { Async } from 'boardgame.io/internal';

/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

/**
 * FlatFile data storage.
 */
export class FlatFile extends Async {
  constructor({ dir, logging, ttl }) {
    super();
    this.games = require('node-persist');
    this.dir = dir;
    this.logging = logging || false;
    this.ttl = ttl || false;
    this.fileQueues = {};
  }

  async chainRequest(key, request) {
    if (!(key in this.fileQueues)) this.fileQueues[key] = Promise.resolve();

    this.fileQueues[key] = this.fileQueues[key].then(request, request);
    return this.fileQueues[key];
  }

  async getItem(key) {
    return this.chainRequest(key, () => this.games.getItem(key));
  }

  async setItem(key, value) {
    return this.chainRequest(key, () => this.games.setItem(key, value));
  }

  async removeItem(key) {
    return this.chainRequest(key, () => this.games.removeItem(key));
  }

  async connect() {
    await this.games.init({
      dir: this.dir,
      logging: this.logging,
      ttl: this.ttl,
    });
    return;
  }

  async createGame(gameID, opts) {
    // Store initial state separately for easy retrieval later.
    const key = InitialStateKey(gameID);

    await this.setItem(key, opts.initialState);
    await this.setState(gameID, opts.initialState);
    await this.setMetadata(gameID, opts.metadata);
  }

  async fetch(gameID, opts) {
    let result = {};

    if (opts.state) {
      result.state = await this.getItem(gameID);
    }

    if (opts.metadata) {
      const key = MetadataKey(gameID);
      result.metadata = await this.getItem(key);
    }

    if (opts.log) {
      const key = LogKey(gameID);
      result.log = await this.getItem(key);
    }

    if (opts.initialState) {
      const key = InitialStateKey(gameID);
      result.initialState = await this.getItem(key);
    }

    return result;
  }

  async clear() {
    return this.games.clear();
  }

  async setState(id, state, deltalog) {
    if (deltalog && deltalog.length > 0) {
      const key = LogKey(id);
      const log = (await this.getItem(key)) || [];

      await this.setItem(key, log.concat(deltalog));
    }

    return await this.setItem(id, state);
  }

  async setMetadata(id, metadata) {
    const key = MetadataKey(id);

    return await this.setItem(key, metadata);
  }

  async wipe(id) {
    var keys = await this.games.keys();
    if (!(keys.indexOf(id) > -1)) return;

    await this.removeItem(id);
    await this.removeItem(InitialStateKey(id));
    await this.removeItem(LogKey(id));
    await this.removeItem(MetadataKey(id));
  }

  async listGames() {
    const keys = await this.games.keys();
    const suffix = ':metadata';
    return keys
      .filter((k) => k.endsWith(suffix))
      .map((k) => k.substring(0, k.length - suffix.length));
  }
}

function InitialStateKey(gameID) {
  return `${gameID}:initial`;
}

function MetadataKey(gameID) {
  return `${gameID}:metadata`;
}

function LogKey(gameID) {
  return `${gameID}:log`;
}
