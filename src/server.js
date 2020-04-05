import { FlatFile, Server } from 'boardgame.io/dist/server';
import { KlaverJassen } from './GameLogic/Game';

const server = Server({
  games: [KlaverJassen],
  db: new FlatFile({
    dir: './storage/klaverjas',
    logging: true
  })
});

const PORT = process.env.PORT || 8000;
server.run(PORT, () => {
  console.log(`Serving at: http://localhost:${PORT}/`);
});
