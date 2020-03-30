import { INVALID_MOVE } from 'boardgame.io/core';
import {
  pointsFromHands,
  handContains,
  PointsOfTrick,
  WinnerOfTrick,
  rankOfTrumpCard
} from 'GameLogic/Card';
import _ from 'lodash';

const isDefined = x => x !== undefined;

export const PlayerToStartCurrentTrick = (
  { dealer, playedTricks },
  { numPlayers }
) => {
  if (playedTricks.length !== 0) {
    // The winner of the previous trick starts the current trick
    const { winner } = playedTricks[playedTricks.length - 1];

    return winner;
  }

  // Rotate based on the previous dealer
  return (dealer + 1) % numPlayers;
};

const startNewTrick = (G, ctx) => {
  G.currentTrick = {
    startingPlayer: PlayerToStartCurrentTrick(G, ctx),
    playedCards: {
      0: undefined,
      1: undefined,
      2: undefined,
      3: undefined
    }
  };
};

function PlayCardException(message, metadata) {
  this.message = message;
  this.metadata = metadata;
  this.toString = () => this.message;
}

export const playerIsAllowedToPlayCard = (
  { currentTrick: { playedCards, startingPlayer }, bid: { trump }, hands },
  player,
  card
) => {
  const handOfPlayer = hands[player];
  if (!handContains(handOfPlayer, card)) {
    return false;
  }

  const cardByStartingPlayer = playedCards[startingPlayer];

  // The current player is the starting player, so they can decide the suit
  if (cardByStartingPlayer === undefined) {
    if (startingPlayer !== player) {
      return false;
    }

    return true;
  }

  // Someone else started this trick, deciding the suit that must be followed
  const { suit: suitOfFirstCard } = cardByStartingPlayer;

  const sameSuitAs = expectedSuit => ({ suit }) => suit === expectedSuit;
  const trumpIsAsked = cardByStartingPlayer.suit === trump;
  const canFollowSuit = _.some(handOfPlayer, sameSuitAs(suitOfFirstCard));
  const canTrump = _.some(handOfPlayer, sameSuitAs(trump));

  const highestPlayedTrumpCard = _(playedCards)
    .filter(isDefined)
    .filter(sameSuitAs(trump))
    .map(rankOfTrumpCard)
    .max();

  const playerCanOvertrump =
    highestPlayedTrumpCard === undefined ||
    _(handOfPlayer)
      .reject(({ suit, face }) => suit === card.suit && face === card.face)
      .filter(sameSuitAs(trump))
      .map(rankOfTrumpCard)
      .some(value => value > highestPlayedTrumpCard);

  const trumpValueOfCard = rankOfTrumpCard(card);
  const playerTriedToUnderTrump = trumpValueOfCard < highestPlayedTrumpCard;

  // TODO: refactor to separate methods
  if (trumpIsAsked) {
    if (playerCanOvertrump && playerTriedToUnderTrump) {
      return false;
    }

    if (card.suit === trump) {
      return true;
    }

    return !canFollowSuit;
  }

  if (canFollowSuit) {
    return card.suit === suitOfFirstCard;
  }

  if (trickIsMates(player, playedCards, cardByStartingPlayer, trump)) {
    return true;
  }

  if (!canTrump) {
    return true;
  }

  if (
    playerCanOvertrump &&
    (card.suit !== trump || card.face < highestPlayedTrumpCard)
  ) {
    return false;
  }

  if (playerCanOvertrump && playerTriedToUnderTrump) {
    return false;
  }

  return true;
};

const removeCardFromPlayer = (G, player, card) => {
  G.hands[player] = _.reject(G.hands[player], ({ suit, face }) => {
    return suit === card.suit && face === card.face;
  });
};

const trickIsMates = (player, playedCards, cardByStartingPlayer, trump) => {
  const teamMate = (player + 2) % 4;

  // TERRIBLE HACK: WinnerOfTrick expects 4 cards to be passed on, but
  // we haven't played 4 cards yet
  // AMSTERDAMS
  const winner =
    4 -
    _.filter(playedCards, isDefined).length +
    WinnerOfTrick(
      _.filter(playedCards, isDefined),
      cardByStartingPlayer,
      trump
    );

  return winner === teamMate;
};

export const PlayCard = (G, { currentPlayer }, card) => {
  const player = parseInt(currentPlayer, 10);

  try {
    const {
      currentTrick: { playedCards = [], startingPlayer }
    } = G;
    const cardByStartingPlayer = playedCards[startingPlayer];
    if (cardByStartingPlayer === undefined && startingPlayer !== player) {
      throw new PlayCardException(
        'Someone else than the starting player tried to play the first card',
        {
          startingPlayer,
          player
        }
      );
    }

    if (!playerIsAllowedToPlayCard(G, player, card)) {
      return INVALID_MOVE;
    }
  } catch (e) {
    return INVALID_MOVE;
  }

  // Keep track of the card played by player
  G.currentTrick.playedCards[player] = { ...card, playedBy: player };

  removeCardFromPlayer(G, player, card);
};

export const CallVerzaakt = (G, ctx) => {};

const ATrickHasBeenPlayed = ({ currentTrick }, { numPlayers }) => {
  const { playedCards } = currentTrick;

  // The current trick contains the card played by each player
  return _.filter(playedCards, isDefined).length === numPlayers;
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
    cards: _.map(playedCards, card => card)
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

const keepScoreOfPlayedRound = (G, ctx) => {
  const { wij, zij } = pointsFromHands(G);

  G.rounds.push({ wij, zij });
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

export const PlayTricks = {
  next: 'PlayTricks',
  moves: { PlayCard, CallVerzaakt },
  onBegin: startNewTrick,
  endIf: ATrickHasBeenPlayed,
  onEnd: (G, ctx) => {
    AfterFinishingTrick(G, ctx);

    const playedTricks = G.playedTricks;
    if (playedTricks.length !== 8) {
      return;
    }
    AfterFinishingHand(G, ctx);
  },

  turn: {
    moveLimit: 1,
    order: {
      first: ({ currentTrick: { startingPlayer } }, ctx) => startingPlayer,
      next: (G, { playOrderPos, numPlayers }) => (playOrderPos + 1) % numPlayers
    }
  }
};
