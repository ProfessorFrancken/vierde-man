import { InitialDeck } from 'GameLogic/Card';
import { PlaceBids } from 'GameLogic/Phases/PlaceBids';
import { PlayTricks } from 'GameLogic/Phases/PlayTricks';
import Randomness from 'GameLogic/Phases/Random';

const SixTeenRoundsHaveBeenPlayed = (G, ctx) => {
  return G.rounds.length === 4 * 4
    ? {
        winner: G.wij === G.zij ? 'Wij & Zij' : G.wij > G.zij ? 'wij' : 'zij',
        wij: G.wij,
        zij: G.zij
      }
    : false;
};
export const KlaverJassen = {
  name: 'klarver-jassen',

  setup: ctx => {
    return {
      deck: InitialDeck(),
      rounds: [],
      playedTricks: [],
      bid: {
        bid: undefined,
        highestBidBy: undefined,
        trump: undefined
      },
      bids: [],
      currentTrick: {
        startingPlayer: undefined,
        playedCards: {
          0: undefined,
          1: undefined,
          2: undefined,
          3: undefined
        }
      },
      dealer: ctx.numPlayers - 1,
      wij: 0,
      zij: 0
    };
  },

  turn: {
    moveLimit: 1
  },

  phases: {
    PlaceBids,
    PlayTricks
  },
  plugins: [Randomness],

  // Ends the game if this returns anything.
  // The return value is available in `ctx.gameover`.
  endIf: SixTeenRoundsHaveBeenPlayed,

  // Called at the end of the game.
  // `ctx.gameover` is available at this point.
  onEnd: (G, ctx) => G
};
