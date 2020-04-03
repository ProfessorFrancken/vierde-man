import { ActivePlayers } from 'boardgame.io/core';
import { pointsFromHands, PointsOfTrick, WinnerOfTrick } from '../Card';
import { startNewTrick, PlayerToStartCurrentTrick } from './PlayTricks';
import _ from 'lodash';

const isDefined = x => x !== undefined;

const keepScoreOfPlayedRound = (G, ctx) => {
  const { wij, zij } = pointsFromHands(G);

  G.rounds.push({
    wij,
    zij,
    dealer: G.dealer,
    playedTricks: [...G.playedTricks],
    bids: [...G.bids]
  });
  G.wij = _.sum(_.map(G.rounds, ({ wij }) => wij));
  G.zij = _.sum(_.map(G.rounds, ({ zij }) => zij));
};

// Reset bids so that we can start bidding again
const startANewRound = (G, ctx) => {
  G.playedTricks = [];
  G.bids = [];
  G.bid = undefined;
  G.dealer = (G.dealer + 1) % ctx.numPlayers;

  // TODO: check if we can replace this with an end if that returns stuff?
  ctx.events.setPhase('PlaceBids');
};

const AfterFinishingHand = (G, ctx) => {
  keepScoreOfPlayedRound(G, ctx);
  startANewRound(G, ctx);
};

// This phase is used as an intermediate after playing one trick
// it automatically continues to the PlayTrick phase after a short while,
// which should allow each player to see the winning card

const ContinueToNextTrick = (G, ctx, continueAutomatically = false) => {
  G.playesThatWantToContinue.push(ctx.currentPlayer);

  if (G.continueTrickAutomatically === undefined) {
    G.continueTrickAutomatically = {};
  }
  G.continueTrickAutomatically[ctx.currentPlayer] = continueAutomatically;
};

const WriteDownResultsOfTrick = (G, ctx) => {
  G.playesThatWantToContinue = [];

  // Store current trick
};

const AllPlayersAreReady = (G, ctx) => {
  if (G.playesThatWantToContinue === undefined) {
    return false;
  }

  if (G.playesThatWantToContinue.length !== 4) {
    return false;
  }

  // TODO: add the trick at the beginning of the phase instead
  if (G.playedTricks.length === 7) {
    return { next: 'PlaceBids' };
  }

  return true;
};

const finishedTrick = (
  { currentTrick: { playedCards, startingPlayer }, bid },
  ctx
) => {
  if (!_.every(playedCards, isDefined)) {
    return undefined;
  }

  const { trump } = bid;
  const points = PointsOfTrick(playedCards, trump);
  const winner = WinnerOfTrick(playedCards, playedCards[startingPlayer], trump);

  return {
    winner: winner,
    points: points.points,
    honor: points.honor,
    cards: _.map(playedCards, card => card),
    startingPlayer,
    bid
  };
};
const AfterFinishingTrick = (G, ctx) => {
  const resultFromRound = finishedTrick(G, ctx);
  if (resultFromRound === undefined) {
    return;
  }

  G.playedTricks.push(resultFromRound);
  startNewTrick(G, ctx);
};

export const ShowResultOfTrick = {
  next: 'PlayTricks',
  moves: { ContinueToNextTrick },
  onBegin: WriteDownResultsOfTrick,
  endIf: AllPlayersAreReady,
  onEnd: (G, ctx) => {
    G.playesThatWantToContinue = [];

    AfterFinishingTrick(G, ctx);

    if (G.playedTricks.length !== 8) {
      return;
    }
    AfterFinishingHand(G, ctx);
    // Reset currentTrick
    // If
  },

  turn: {
    moveLimit: 1,
    activePlayers: ActivePlayers.ALL
  }
};
