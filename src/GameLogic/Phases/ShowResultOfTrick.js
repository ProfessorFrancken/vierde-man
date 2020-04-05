import { ActivePlayers } from 'boardgame.io/core';
import { PointsOfTrick, WinnerOfTrick } from '../Card';
import { startNewTrick } from './PlayTricks';
import _ from 'lodash';

// This phase is used as an intermediate after playing one trick
// it automatically continues to the PlayTrick phase after a short while,
// which should allow each player to see the winning card

const ContinueToNextTrick = (
  G,
  ctx,
  playerId,
  continueAutomatically = false
) => {
  G.playersThatWantToContinue.push(
    playerId === null ? parseInt(ctx.currentPlayer, 10) : playerId
  );
  G.continueTrickAutomatically[
    playerId === null ? parseInt(ctx.currentPlayer, 10) : playerId
  ] = continueAutomatically;
};

const WriteDownResultsOfTrick = (G, ctx) => {
  G.playersThatWantToContinue = [];

  // Store the trick that was played
  const resultFromRound = finishedTrick(G, ctx);
  if (resultFromRound === undefined) {
    return;
  }

  G.playedTricks.push(resultFromRound);
};

const AllPlayersAreReady = (G, ctx) => {
  if (G.playersThatWantToContinue === undefined) {
    return false;
  }

  if (G.playersThatWantToContinue.length !== 4) {
    return false;
  }

  if (G.playedTricks.length === 8) {
    return { next: 'ShowResultOfHand' };
  }

  return { next: 'PlayTricks' };
};

const finishedTrick = (
  { currentTrick: { playedCards, startingPlayer }, bid },
  ctx
) => {
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

export const ShowResultOfTrick = {
  next: 'PlayTricks',
  moves: { ContinueToNextTrick },
  onBegin: WriteDownResultsOfTrick,
  endIf: AllPlayersAreReady,
  onEnd: (G, ctx) => {
    G.playersThatWantToContinue = [];

    startNewTrick(G, ctx);
  },

  turn: {
    moveLimit: 1,
    activePlayers: ActivePlayers.ALL
  }
};
