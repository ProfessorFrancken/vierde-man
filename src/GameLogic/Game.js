import { InitialDeck } from './Card';
import { PlaceBids } from './Phases/PlaceBids';
import { PlayTricks } from './Phases/PlayTricks';
import { ShowResultOfTrick } from './Phases/ShowResultOfTrick';
import { ShowResultOfHand } from './Phases/ShowResultOfHand';
import Randomness from './Random';

const SixTeenRoundsHaveBeenPlayed = (G, ctx) => {
  if (G.bid !== undefined) {
    return false;
  }

  return G.rounds.length === 4 * 4
    ? {
        winner: G.wij === G.zij ? 'Wij & Zij' : G.wij > G.zij ? 'wij' : 'zij',
        wij: G.wij,
        zij: G.zij,
      }
    : false;
};
export const KlaverJassen = {
  name: 'klarver-jassen',
  numPlayers: 4,
  minPlayers: 4,
  maxPlayers: 4,

  setup: (ctx) => {
    return {
      deck: InitialDeck(),
      createdAt: Date.now(),
      rounds: [],
      playedTricks: [],
      bid: {
        bid: undefined,
        highestBidBy: undefined,
        trump: undefined,
      },
      bids: [],
      currentTrick: {
        startingPlayer: undefined,
        playedCards: {
          0: undefined,
          1: undefined,
          2: undefined,
          3: undefined,
        },
      },
      dealer: ctx.numPlayers - 1,
      wij: 0,
      zij: 0,
      // Player settings
      continueTrickAutomatically: {},
      playersThatWantToContinue: [],
      playersThatWantToPlayNextHand: [],
    };
  },

  turn: {
    moveLimit: 1,
  },

  phases: {
    PlaceBids,
    PlayTricks,
    ShowResultOfTrick,
    ShowResultOfHand,
  },
  plugins: [Randomness],

  // Ends the game if this returns anything.
  // The return value is available in `ctx.gameover`.
  endIf: SixTeenRoundsHaveBeenPlayed,

  // Called at the end of the game.
  // `ctx.gameover` is available at this point.
  onEnd: (G, ctx) => G,
};
