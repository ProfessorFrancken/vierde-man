import { INVALID_MOVE } from 'boardgame.io/core';
import _ from 'lodash';
import { SANS } from '../Card';

const bidIsPass = ({ bid, suit }) => bid === null && suit === null;
export const PASS = null;

export const ShuffleDeck = (G, ctx) => {
  // if (!ctx.random) {
  //   console.log('[ShuffleDeck]', ctx.random, ctx.randomness);
  // }

  G.deck = ctx.randomness.Shuffle(G.deck);
};

export const allowedBidsOnTrump = (bids, trump) =>
  (trump === SANS
    ? [70, 80, 90, 100, 110, 120, 130, 'pit']
    : [82, 92, 102, 112, 122, 132, 142, 152, 162, 'pit']
  ).filter(bid => canPlaceBid(bids, { bid, suit: trump }));

export const DealCards = (G, ctx, deck) => {
  const stacks = _.chunk(deck, 8);

  G.hands = {
    0: stacks[0],
    1: stacks[1],
    2: stacks[2],
    3: stacks[3]
  };
};

const isSans = ({ suit }) => suit === SANS;
const isAValidBid = bid =>
  bid !== undefined && (bid.bid >= 82 || (isSans(bid) && bid.bid >= 70));
export const canPlaceBid = (placedBids, bid) => {
  if (bidIsPass(bid)) {
    return true;
  }

  if (!isAValidBid(bid)) {
    return false;
  }

  // Don't allow duplicate bids
  if (
    _.some(
      placedBids,
      placedBid => bid.suit === placedBid.suit && bid.bid === placedBid.bid
    )
  ) {
    return false;
  }

  const highestBid = _.maxBy(placedBids, bid =>
    bid !== undefined && !bidIsPass(bid) ? bid.bid : 0
  );

  if (highestBid === undefined || highestBid === null) {
    return true;
  }

  if (isSans(bid)) {
    if (isSans(highestBid)) {
      return bid.bid > highestBid.bid;
    }

    return bid.bid >= highestBid.bid - 2;
  }

  if (isSans(highestBid)) {
    return bid.bid > highestBid.bid + 2;
  }

  return bid.bid > highestBid.bid;
};

const reshuffleIfAllPassed = (G, ctx) => {
  const isDefined = x => x !== undefined;

  if (
    _.filter(G.bids, isDefined).length === 4 &&
    _.every(_.filter(G.bids, isDefined), bidIsPass)
  ) {
    ShuffleDeck(G, ctx);
    DealCards(G, ctx, G.deck);
  }
};

export const PlaceBid = (G, ctx, bid) => {
  const { currentPlayer } = ctx;
  if (!canPlaceBid(G.bids, bid)) {
    return INVALID_MOVE;
  }

  G.bids.push({ ...bid, bidBy: parseInt(currentPlayer, 10) });
  reshuffleIfAllPassed(G, ctx);
};

export const Pass = (G, ctx) => PlaceBid(G, ctx, { bid: null, suit: null });

const StartPlacingBids = (G, ctx) => {
  ShuffleDeck(G, ctx);
  DealCards(G, ctx, G.deck);

  G.bid = {
    bids: [],
    highestBidBy: undefined,
    bid: undefined,
    trump: undefined
  };

  G.bids = [];
};

const ThreePlayersHavePassed = ({ bids }, { currentPlayer }) => {
  if (bids.length < 4) {
    return false;
  }

  return (
    !bidIsPass(bids[bids.length - 4]) &&
    bidIsPass(bids[bids.length - 3]) &&
    bidIsPass(bids[bids.length - 2]) &&
    bidIsPass(bids[bids.length - 1])
  );
};

const determineBid = ({ bids }) => {
  const highestBid = _.maxBy(bids, bid =>
    bid !== undefined && !bidIsPass(bid) ? bid.bid : 0
  );

  return {
    highestBidBy: highestBid.bidBy,
    trump: highestBid.suit,
    bid: highestBid.bid
  };
};

const WriteDownBidAndTrump = (G, ctx) => {
  const { highestBidBy, bid, trump } = determineBid(G);

  G.bid = { highestBidBy, bid, trump };
};

export const PlaceBids = {
  start: true,
  next: 'PlayTricks',
  moves: { PlaceBid, Pass },
  onBegin: StartPlacingBids,
  endIf: ThreePlayersHavePassed,
  onEnd: WriteDownBidAndTrump,
  turn: {
    moveLimit: 1,
    order: {
      first: ({ dealer }, { numPlayers }) => (dealer + 1) % numPlayers,
      next: (G, { playOrderPos, numPlayers }) => (playOrderPos + 1) % numPlayers
    }
  }
};
