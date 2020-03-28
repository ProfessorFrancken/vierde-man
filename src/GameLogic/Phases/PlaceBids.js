import { INVALID_MOVE } from 'boardgame.io/core';
import _ from 'lodash';
import {
  handContains,
  Card,
  InitialDeck,
  SANS,
  SUITES,
  FACES
} from 'GameLogic/Card';

const bidIsPass = ({ bid, suit }) => bid === null && suit === null;
export const PASS = null;

export const ShuffleDeck = (G, ctx) => {
  // if (!ctx.random) {
  //   console.log('[ShuffleDeck]', ctx.random, ctx.randomness);
  // }

  G.deck = ctx.randomness.Shuffle(G.deck);
};

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
  bid !== undefined && (bid.bid >= 80 || (isSans(bid) && bid.bid >= 70));
export const canPlaceBid = (placedBids, bid) => {
  if (!isAValidBid(bid)) {
    return false;
  }

  const highestBid = _.maxBy(Object.values(placedBids), bid =>
    bid !== undefined && !bidIsPass(bid) ? bid.bid : 0
  );
  if (highestBid === undefined || highestBid === null) {
    return true;
  }

  if (bid.bid > highestBid.bid) {
    return true;
  }

  if (isSans(bid) && !isSans(highestBid)) {
    return bid.bid === highestBid.bid;
  }

  return false;
};
export const PlaceBid = (G, { currentPlayer }, bid) => {
  if (!canPlaceBid(G.bids, bid)) {
    return INVALID_MOVE;
  }

  G.bids[currentPlayer] = { ...bid, bidBy: parseInt(currentPlayer, 10) };
};

export const Pass = (G, { currentPlayer }) => {
  G.bids[currentPlayer] = {
    bid: null,
    suit: null,
    bidBy: parseInt(currentPlayer, 10)
  };
};

const StartPlacingBids = (G, ctx) => {
  ShuffleDeck(G, ctx);
  DealCards(G, ctx, G.deck);

  G.bid = {
    bids: {
      0: undefined,
      1: undefined,
      2: undefined,
      3: undefined
    },
    highestBidBy: undefined,
    bid: undefined,
    trump: undefined
  };

  G.bids = {
    0: undefined,
    1: undefined,
    2: undefined,
    3: undefined
  };
};

const ThreePlayersHavePassed = ({ bids }, ctx) => {
  return (
    _.every(bids, bid => bid !== undefined) &&
    _.filter(bids, bid => !bidIsPass(bid)).length === 1 &&
    _.filter(bids, bid => bidIsPass(bid)).length === 3
  );
};

const determineBid = ({ bids }) => {
  const highestBid = _.maxBy(Object.values(bids), bid =>
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
  G.trump = trump;
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
