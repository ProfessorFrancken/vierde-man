import _ from 'lodash';
import { isAfter, subDays, parse, format, fromUnixTime } from 'date-fns';

const fetchRecentGames = async (db, gamesAfter) => {
  const gameIds = await db.listGames();

  const games = await Promise.all(
    gameIds.map(async (gameID) => {
      const {
        state: { G },
        metadata: { players },
      } = await db.fetch(gameID, { state: true, metadata: true });

      const createdAt = G.createdAt
        ? fromUnixTime(G.createdAt / 1000)
        : undefined;

      return {
        createdAt,
        rounds: G.rounds.length,
        wij: G.wij,
        zij: G.zij,
        players: _.map(players, (player) => ({
          id: player.id,
          name: player.name || 'unkown player',
          team: [0, 2].includes(player.id) ? 'Wij' : 'Zij',
        })),
      };
    })
  );

  return games.filter(
    ({ createdAt }) => createdAt !== undefined && isAfter(createdAt, gamesAfter)
  );
};

const toCSVArray = (games) => {
  return [
    // Add a table header
    [
      'Created at',
      'Rounds',
      'Wij',
      'Wij',
      'Points (wij)',
      'Zij',
      'Zij',
      'Points (Zij)',
    ],
    // table body
    ...games.map((game) => {
      return [
        game.createdAt
          ? format(game.createdAt, 'yyyy-MM-dd HH:mm')
          : 'unkown date',
        game.rounds,
        game.players[0].name,
        game.players[2].name,
        game.wij,
        game.players[1].name,
        game.players[3].name,
        game.zij,
      ];
    }),
  ];
};

const returnCsv = (ctx, content) => {
  ctx.statusCode = 200;
  ctx.set(
    'Content-disposition',
    `attachment; filename=klaverjas-tournament.csv`
  );
  ctx.body = content;
};

export const addTournamentRoute = (router, db) => {
  router.get('/tournament', async (ctx) => {
    const gamesAfter = ctx.query.after
      ? parse(ctx.query.after, 'yyyy-MM-dd', new Date())
      : subDays(new Date(), 1);

    const content = toCSVArray(await fetchRecentGames(db, gamesAfter))
      .map((column) => column.join(';'))
      .join('\n');

    returnCsv(ctx, content);
  });
};
