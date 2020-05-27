import { FlatFile, Server } from 'boardgame.io/dist/server';
import { KlaverJassen } from './../GameLogic/Game';
import { StorageCache } from 'bgio-storage-cache';
import Router from 'koa-router';
import cors from '@koa/cors';
import { addTournamentRoute } from './tournament';

const db = new FlatFile({
  dir: './storage/klaverjas',
  logging: true,
});
const dbWithCaching = new StorageCache(db, { cacheSize: 200 });

const OldKlarverJassen = { ...KlaverJassen, name: 'klarver-jassen' };
const server = Server({
  games: [KlaverJassen, OldKlarverJassen],
  db: dbWithCaching,
});

const router = new Router();
router.get('/games/:name', async (ctx) => {
  const gameName = ctx.params.name;
  const gameList = await dbWithCaching.listGames(gameName);
  let rooms = [];
  for (let gameID of gameList) {
    const { metadata, state } = await dbWithCaching.fetch(gameID, {
      state: true,
      metadata: true,
    });
    const G = state.G;

    rooms.push({
      gameID,
      phase: state.ctx.phase,
      turn: state.ctx.turn,
      createdAt: G.createdAt,
      roundsPlayed: G.rounds.length,
      maxRounds: G.maxRounds || 16,
      wij: G.wij,
      zij: G.zij,
      currentPlayer: state.ctx.currentPlayer,

      // strip away credentials
      players: Object.values(metadata.players).map((player) => ({
        id: player.id,
        name: player.name,
      })),
      setupData: metadata.setupData,
    });
  }
  ctx.body = {
    rooms: rooms,
  };
});

addTournamentRoute(router, dbWithCaching);

// TODO: verify if this is needed for the koa app
server.app.use(cors()).use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 8000;
server.run(PORT, () => {
  console.log(`Serving at: http://localhost:${PORT}/`);
});
