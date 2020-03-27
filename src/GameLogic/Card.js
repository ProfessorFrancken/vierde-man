import React from 'react';
import 'lodash.product';
import _ from 'lodash';

export const SANS = 'SANS';
export const SUITES = {
  SPADES: 'S',
  CLUBS: 'C',
  DIAMONDS: 'D',
  HEARTS: 'H'
};
export const FACES = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
// prettier-ignore
export const trumpCardToValues = {
    'J': 20, '9': 14, 'A': 11, '10': 10, 'K': 4, 'Q': 3, '8': 0, '7': 0
}
// prettier-ignore
const nonTrumpCardToValues = {
    'A': 11, '10': 10, 'K': 4, 'Q': 3, 'J': 2, '9': 0, '8': 0, '7': 0
}

export const InitialDeck = () =>
  _.product(SUITES, FACES).map(([suit, face]) => Card(suit, face));

const valueOf = (face, isTrump) => {
  return isTrump ? trumpCardToValues[face] : nonTrumpCardToValues[face];
};

const HonorPointsOfTrick = (trick, trump) => {
  let honorPoints = 0;

  const cardsBySuit = _.mapValues(
    _.groupBy(trick, ({ suit }) => suit),
    suit => _(suit).map(({ face }) => face)
  );

  const containsThreeConsecutiveCards = _.some(cardsBySuit, faces => {
    const possibleCombinations = [
      ['7', '8', '9'],
      ['8', '9', '10'],
      ['9', '10', 'J'],
      ['10', 'J', 'Q'],
      ['J', 'Q', 'K'],
      ['Q', 'K', 'A']
    ];
    return _(possibleCombinations).some(
      facesFromCombination =>
        faces.includes(facesFromCombination[0]) &&
        faces.includes(facesFromCombination[1]) &&
        faces.includes(facesFromCombination[2])
    );
  });

  const containsFourConsecutiveCards = _.some(cardsBySuit, faces => {
    const possibleCombinations = [
      ['7', '8', '9', '10'],
      ['8', '9', '10', 'J'],
      ['9', '10', 'J', 'Q'],
      ['10', 'J', 'Q', 'K'],
      ['J', 'Q', 'K', 'A']
    ];
    return _(possibleCombinations).some(
      facesFromCombination =>
        faces.includes(facesFromCombination[0]) &&
        faces.includes(facesFromCombination[1]) &&
        faces.includes(facesFromCombination[2]) &&
        faces.includes(facesFromCombination[3])
    );
  });
  if (containsFourConsecutiveCards) {
    honorPoints += 30;
  }
  if (containsThreeConsecutiveCards) {
    honorPoints += 20;
  }

  const countPerFace = _(trick)
    .groupBy('face')
    .map((items, name) => items.length)
    .value();

  const containsFourOfTheSameFace = countPerFace[0] === 4;

  if (containsFourOfTheSameFace) {
    honorPoints += 100;
  }

  const trumpCards = cardsBySuit[trump] || [];
  const containsStuk = trumpCards.includes('K') && trumpCards.includes('Q');

  if (containsStuk) {
    honorPoints += 20;
  }

  return honorPoints;
};

export const PointsOfTrick = (trick, trump) => {
  const pointsFromFaces = _.sum(
    _.map(trick, card => valueOf(card.face, card.suit === trump))
  );
  const pointsFromHonor = HonorPointsOfTrick(trick, trump);

  return {
    points: pointsFromFaces,
    honor: pointsFromHonor
  };
};

export const WinnerOfTrick = (trick, firstCard, trump) => {
  const orderOfNonTrumpCards = ['7', '8', '9', 'J', 'Q', 'K', '10', 'A'];
  const orderOfTrumpCards = ['7', '8', 'Q', 'K', '10', 'A', '9', 'J'];

  const rankTrickByCardValue = _.mapValues(trick, ({ face, suit }) => {
    if (suit === firstCard.suit) {
      return orderOfNonTrumpCards.findIndex(x => x === face);
    }

    // HACK: we know there are only 8 cards so adding 10 to trump cards
    // makes sure that trump cards always win over other cards
    if (suit === trump) {
      return 10 + orderOfTrumpCards.findIndex(x => x === face);
    }

    // HACK: players not following suit or trumping can't win
    return -1;
  });

  // Find the id of the player with the highest card
  const winner = _.maxBy(
    Object.keys(rankTrickByCardValue),
    o => rankTrickByCardValue[o]
  );

  return parseInt(winner, 10);
};

export const PASS = null;
export const Card = (suit, face) => ({ suit, face });
export const handContains = (hand, card) =>
  hand.filter(({ suit, face }) => suit === card.suit && face === card.face)
    .length === 1;

export const pointsFromHands = ({ playedTricks, bid }) => {
  const [tricksByWij, tricksByZij] = _.partition(playedTricks, ({ winner }) =>
    [0, 2].includes(winner)
  );

  const computePointsAndHonor = (tricks, includesLastTrick) =>
    _.reduce(
      tricks,
      ({ points, honor }, trick) => ({
        points: points + trick.points,
        honor: honor + trick.honor
      }),
      {
        // Give extra points for winning the last trick
        points: includesLastTrick ? 10 : 0,
        // Give extra honor if the team earned a pitje
        honor: tricks.length === 8 ? 100 : 0
      }
    );

  // The last trick is worth an additional 10 points
  const lastTrick = playedTricks[playedTricks.length - 1];

  // Compute the points for each trick won by each team
  const { points: wij, honor: wij_honor } = computePointsAndHonor(
    tricksByWij,
    [0, 2].includes(lastTrick.winner)
  );
  const { points: zij, honor: zij_honor } = computePointsAndHonor(
    tricksByZij,
    [1, 3].includes(lastTrick.winner)
  );

  const weWentWet =
    [0, 2].includes(bid.highestBidBy) && bid.bid > wij + wij_honor;
  if (weWentWet) {
    return {
      wij: 0,
      zij: wij + zij + wij_honor + zij_honor
    };
  }

  const theyWentWet =
    [1, 3].includes(bid.highestBidBy) && bid.bid > zij + zij_honor;
  if (theyWentWet) {
    return {
      wij: wij + zij + wij_honor + zij_honor,
      zij: 0
    };
  }

  // TODO:
  // - Pitje
  // - Pitje + SANS

  return {
    wij: wij + wij_honor,
    zij: zij + zij_honor
  };
};
