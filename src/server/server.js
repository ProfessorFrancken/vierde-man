import { FlatFile, Server } from 'boardgame.io/dist/server';
import { KlaverJassen } from './../GameLogic/Game';
import { StorageCache } from 'bgio-storage-cache';

const db = new FlatFile({
  dir: './storage/klaverjas',
  logging: true,
});
const dbWithCaching = new StorageCache(db, { cacheSize: 200 });

const server = Server({
  games: [KlaverJassen],
  db: dbWithCaching,
});

const PORT = process.env.PORT || 8000;
server.run(PORT, () => {
  console.log(`Serving at: http://localhost:${PORT}/`);
});
