import { ActivePlayers } from 'boardgame.io/core';
import { pointsFromHands } from '../Card';
import _ from 'lodash';

// This phase is used as an intermediate after playing a hand where a player clicks the "Play next hand button"
export const PlayNextHand = (
  G,
  ctx,
  playerId,
  continueAutomatically = false
) => {
  G.playersThatWantToPlayNextHand.push(
    playerId === null ? parseInt(ctx.currentPlayer, 10) : playerId
  );
  G.continueTrickAutomatically[
    playerId === null ? parseInt(ctx.currentPlayer, 10) : playerId
  ] = continueAutomatically;
};

const AllPlayersAreReady = (G, ctx) => {
  if (G.playersThatWantToPlayNextHand === undefined) {
    return false;
  }

  return G.playersThatWantToPlayNextHand.length === 4;
};

const AfterFinishingHand = (G, ctx) => {
  // Reset new round
  G.playedTricks = [];
  G.bids = [];
  G.bid = undefined;
  G.dealer = (G.dealer + 1) % ctx.numPlayers;
};

export const ShowResultOfHand = {
  next: 'PlaceBids',
  moves: { PlayNextHand },
  onBegin: (G, ctx) => {
    G.playersThatWantToPlayNextHand = [];

    const { wij, zij, wet, pit } = pointsFromHands(G);
    G.rounds.push({
      wij,
      zij,
      wet,
      pit,
      dealer: G.dealer,
      playedTricks: [...G.playedTricks],
      bids: [...G.bids],
      finishedAt: Date.now(),
    });
    G.wij = _.sum(_.map(G.rounds, ({ wij }) => wij));
    G.zij = _.sum(_.map(G.rounds, ({ zij }) => zij));
  },
  endIf: AllPlayersAreReady,
  onEnd: (G, ctx) => {
    G.playersThatWantToPlayNextHand = [];
    AfterFinishingHand(G, ctx);
  },
  turn: {
    moveLimit: 1,
    activePlayers: ActivePlayers.ALL,
  },
};
