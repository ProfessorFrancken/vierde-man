import { INVALID_MOVE } from 'boardgame.io/core';
import { handContains, WinnerOfTrick, rankOfTrumpCard } from '../Card';
import _ from 'lodash';

const isDefined = (x) => x !== undefined;

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

export const startNewTrick = (G, ctx) => {
  G.currentTrick = {
    startingPlayer: PlayerToStartCurrentTrick(G, ctx),
    playedCards: {
      0: undefined,
      1: undefined,
      2: undefined,
      3: undefined,
    },
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

  const sameSuitAs = (expectedSuit) => ({ suit }) => suit === expectedSuit;
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
      .some((value) => value > highestPlayedTrumpCard);

  const trumpValueOfCard = rankOfTrumpCard(card);
  const playerTriedToUnderTrump =
    card.suit === trump && trumpValueOfCard < highestPlayedTrumpCard;

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

  if (
    playerTriedToUnderTrump &&
    handOfPlayer.some(({ suit }) => suit !== trump)
  ) {
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
  if (playedCards[teamMate] === undefined) {
    return false;
  }

  const winner = WinnerOfTrick(
    _.filter(playedCards, isDefined),
    cardByStartingPlayer,
    trump
  );

  return teamMate === winner;
};

export const PlayCard = (G, { currentPlayer }, card) => {
  const player = parseInt(currentPlayer, 10);

  try {
    const {
      currentTrick: { playedCards = [], startingPlayer },
    } = G;
    const cardByStartingPlayer = playedCards[startingPlayer];
    if (cardByStartingPlayer === undefined && startingPlayer !== player) {
      throw new PlayCardException(
        'Someone else than the starting player tried to play the first card',
        {
          startingPlayer,
          player,
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

  // TODO: change end if so that:
  // It summarizes a trick when a single trick has been played
  // It summarizes a hand when 8 tricks have been played
};

export const PlayTricks = {
  next: 'ShowResultOfTrick',
  moves: { PlayCard, CallVerzaakt },
  onBegin: startNewTrick,
  endIf: ATrickHasBeenPlayed,
  onEnd: (G, ctx) => {
    // AfterFinishingTrick(G, ctx);
    // const playedTricks = G.playedTricks;
    // if (playedTricks.length !== 8) {
    //   return;
    // }
    // AfterFinishingHand(G, ctx);
  },

  turn: {
    moveLimit: 1,
    order: {
      first: ({ currentTrick: { startingPlayer } }, ctx) => startingPlayer,
      next: (G, { playOrderPos, numPlayers }) =>
        (playOrderPos + 1) % numPlayers,
    },
  },
};
