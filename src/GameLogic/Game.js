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

  const maxRounds = G.maxRounds || 16;

  return G.rounds.length === maxRounds
    ? {
        winner: G.wij === G.zij ? 'Wij & Zij' : G.wij > G.zij ? 'wij' : 'zij',
        wij: G.wij,
        zij: G.zij,
      }
    : false;
};
export const KlaverJassen = {
  name: 'klaver-jassen',
  numPlayers: 4,
  minPlayers: 4,
  maxPlayers: 4,

  setup: (ctx, setupData = {}) => {
    return {
      deck: InitialDeck(),
      maxRounds: setupData.maxRounds || 16,
      createdAt: Date.now(),
      rounds: [],
      playedTricks: [],

      // The bid that's currently being played
      bid: {
        bid: undefined,
        highestBidBy: undefined,
        trump: undefined,
      },
      // Bids placed by players
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
