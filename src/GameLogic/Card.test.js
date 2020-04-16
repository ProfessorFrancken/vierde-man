import {
  pointsFromHands,
  PointsOfTrick,
  WinnerOfTrick,
  handContains,
  Card,
  InitialDeck,
  SANS,
  SUITES,
  FACES,
} from 'GameLogic/Card';
import _ from 'lodash';

const { SPADES, HEARTS, CLUBS, DIAMONDS } = SUITES;
describe('Determines the winner of a trick', () => {
  it('determines the winner of the trick by', () => {
    const trump = SUITES.SPADES;
    const winner = WinnerOfTrick(
      {
        '0': { ...Card(SPADES, 'J'), playedBy: 0 },
        '1': { ...Card(HEARTS, '7'), playedBy: 1 },
        '2': { ...Card(CLUBS, '7'), playedBy: 2 },
        '3': { ...Card(DIAMONDS, '9'), playedBy: 3 },
      },
      Card(SPADES, 'J'),
      trump
    );

    expect(winner).toEqual(0);
  });

  it('determines the winner of when using trump', () => {
    const winner = WinnerOfTrick(
      {
        '0': { ...Card(CLUBS, '10'), playedBy: 0 },
        '1': { ...Card(CLUBS, 'A'), playedBy: 1 },
        '2': { ...Card(CLUBS, '9'), playedBy: 2 },
        '3': { ...Card(CLUBS, 'J'), playedBy: 3 },
      },
      Card(CLUBS, '10'),
      CLUBS
    );

    expect(winner).toEqual(3);
  });

  it('when no trump is played the highest card wins', () => {
    const trump = SUITES.SPADES;
    const winner = WinnerOfTrick(
      {
        '0': { ...Card(HEARTS, 'J'), playedBy: 0 },
        '1': { ...Card(HEARTS, '7'), playedBy: 1 },
        '2': { ...Card(HEARTS, 'A'), playedBy: 2 },
        '3': { ...Card(DIAMONDS, '9'), playedBy: 3 },
      },
      Card(HEARTS, 'J'),
      trump
    );

    expect(winner).toEqual(2);
  });

  it(`cards not following suit don't count`, () => {
    const trump = SUITES.SPADES;
    const winner = WinnerOfTrick(
      {
        '0': { ...Card(DIAMONDS, 'J'), playedBy: 0 },
        '1': { ...Card(DIAMONDS, 'A'), playedBy: 1 },
        '2': { ...Card(HEARTS, 'Q'), playedBy: 2 },
        '3': { ...Card(HEARTS, 'J'), playedBy: 3 },
      },
      Card(HEARTS, 'J'),
      trump
    );

    expect(winner).toEqual(2);
  });

  it('allows players to overtrump', () => {
    const trump = SUITES.SPADES;
    const winner = WinnerOfTrick(
      {
        '0': { ...Card(DIAMONDS, 'J'), playedBy: 0 },
        '1': { ...Card(SPADES, 'A'), playedBy: 1 },
        '2': { ...Card(HEARTS, 'Q'), playedBy: 2 },
        '3': { ...Card(HEARTS, 'J'), playedBy: 3 },
      },
      Card(HEARTS, 'J'),
      trump
    );

    expect(winner).toEqual(1);
  });

  it('allows players to overtrump twice', () => {
    const trump = SUITES.SPADES;
    const winner = WinnerOfTrick(
      {
        '0': { ...Card(DIAMONDS, 'J'), playedBy: 0 },
        '1': { ...Card(SPADES, 'A'), playedBy: 1 },
        '2': { ...Card(HEARTS, 'Q'), playedBy: 2 },
        '3': { ...Card(SPADES, 'J'), playedBy: 3 },
      },
      Card(DIAMONDS, 'J'),
      trump
    );

    expect(winner).toEqual(3);
  });

  it('rank of normal cards when playing sans', () => {
    const trump = SANS;
    const winner = WinnerOfTrick(
      {
        '0': { ...Card(DIAMONDS, 'J'), playedBy: 0 },
        '1': { ...Card(DIAMONDS, 'Q'), playedBy: 1 },
        '2': { ...Card(DIAMONDS, 'K'), playedBy: 2 },
        '3': { ...Card(DIAMONDS, '10'), playedBy: 3 },
      },
      Card(DIAMONDS, 'K'),
      trump
    );

    expect(winner).toEqual(3);
  });

  it('rank of normal cards when playing sans 2', () => {
    const trump = SANS;
    const winner = WinnerOfTrick(
      {
        '0': { ...Card(CLUBS, '10'), playedBy: 0 },
        '1': { ...Card(SPADES, 'J'), playedBy: 1 },
        '2': { ...Card(SPADES, '10'), playedBy: 2 },
        '3': { ...Card(SPADES, 'K'), playedBy: 3 },
      },
      Card(SPADES, '10'),
      trump
    );

    expect(winner).toEqual(2);
  });
});

describe('Points of a trick', () => {
  describe('When spades is trump', () => {
    const trump = SUITES.SPADES;
    it('gives points to the jack', () => {
      const { points, honor } = PointsOfTrick(
        {
          '0': { ...Card(SPADES, 'J'), playedBy: 0 },
          '1': { ...Card(HEARTS, '7'), playedBy: 1 },
          '2': { ...Card(CLUBS, '7'), playedBy: 2 },
          '3': { ...Card(DIAMONDS, '9'), playedBy: 3 },
        },
        trump
      );

      expect(points + honor).toEqual(20);
    });

    it('gives points to the nel', () => {
      const { points, honor } = PointsOfTrick(
        {
          '0': { ...Card(SPADES, '9'), playedBy: 0 },
          '1': { ...Card(HEARTS, '7'), playedBy: 1 },
          '2': { ...Card(CLUBS, '7'), playedBy: 2 },
          '3': { ...Card(DIAMONDS, '9'), playedBy: 3 },
        },
        trump
      );

      expect(points + honor).toEqual(14);
    });

    it('gives points to the queen', () => {
      const { points, honor } = PointsOfTrick(
        {
          '0': { ...Card(SPADES, 'Q'), playedBy: 0 },
          '1': { ...Card(HEARTS, '7'), playedBy: 1 },
          '2': { ...Card(CLUBS, 'Q'), playedBy: 2 },
          '3': { ...Card(DIAMONDS, '9'), playedBy: 3 },
        },
        trump
      );

      expect(points + honor).toEqual(6);
    });

    const hands = [
      {
        points: 0,
        cards: [
          Card(HEARTS, '7'),
          Card(HEARTS, '8'),
          Card(SPADES, '8'),
          Card(DIAMONDS, '7'),
        ],
      },
      {
        points: 21,
        cards: [
          Card(HEARTS, '10'),
          Card(HEARTS, 'A'),
          Card(SPADES, '8'),
          Card(DIAMONDS, '7'),
        ],
      },
      {
        points: 28,
        cards: [
          Card(HEARTS, '10'),
          Card(HEARTS, 'A'),
          Card(SPADES, 'Q'),
          Card(DIAMONDS, 'K'),
        ],
      },
    ];

    hands.forEach((hand) => {
      it('gives the value of a trick', () => {
        const { points, honor } = PointsOfTrick(
          {
            '0': hand.cards[0],
            '1': hand.cards[1],
            '2': hand.cards[2],
            '3': hand.cards[3],
          },
          trump
        );

        expect(points + honor).toEqual(hand.points);
      });
    });

    describe('tricks with honor', () => {
      it('gives extra points when the trick contains a stuk', () => {
        const { points, honor } = PointsOfTrick(
          {
            '0': Card(HEARTS, 'K'),
            '1': Card(HEARTS, 'Q'),
            '2': Card(CLUBS, '7'),
            '3': Card(DIAMONDS, '9'),
          },
          trump
        );

        expect(points + honor).toEqual(7);

        const p = PointsOfTrick(
          {
            '0': Card(SPADES, 'K'),
            '1': Card(SPADES, 'Q'),
            '2': Card(CLUBS, '7'),
            '3': Card(DIAMONDS, '9'),
          },
          trump
        );

        expect(p.points + p.honor).toEqual(27);
      });
      // Driekaart
      it('gives honor for three consecutive cards of the same suit', () => {
        const combinations = [
          { cards: ['7', '8', '9'], pointsOfFaces: 0 },
          { cards: ['8', '9', '10'], pointsOfFaces: 10 },
          { cards: ['9', '10', 'J'], pointsOfFaces: 12 },
          { cards: ['10', 'J', 'Q'], pointsOfFaces: 15 },
          { cards: ['J', 'Q', 'K'], pointsOfFaces: 9 },
          { cards: ['Q', 'K', 'A'], pointsOfFaces: 18 },
        ];

        combinations.forEach(({ cards, pointsOfFaces }) => {
          const { points, honor } = PointsOfTrick(
            {
              '0': Card(HEARTS, cards[0]),
              '1': Card(HEARTS, cards[1]),
              '2': Card(HEARTS, cards[2]),
              '3': Card(DIAMONDS, '9'),
            },
            trump
          );

          expect(points + honor).toEqual(20 + pointsOfFaces);
        });
      });

      it('gives honor for three consecutive cards of the same suit + stuk points', () => {
        const combinations = [
          { cards: ['J', 'Q', 'K'], pointsOfFaces: 27 },
          { cards: ['Q', 'K', 'A'], pointsOfFaces: 18 },
        ];

        combinations.forEach(({ cards, pointsOfFaces }) => {
          const { points, honor } = PointsOfTrick(
            {
              '0': Card(SPADES, cards[0]),
              '1': Card(SPADES, cards[1]),
              '2': Card(SPADES, cards[2]),
              '3': Card(DIAMONDS, '9'),
            },
            trump
          );

          expect(points + honor).toEqual(20 + 20 + pointsOfFaces);
        });
      });

      // Vierkaart
      it('gives honor for four consecutive cards of the same suit', () => {
        const combinations = [
          { cards: ['7', '8', '9', '10'], pointsOfFaces: 10 },
          { cards: ['8', '9', '10', 'J'], pointsOfFaces: 12 },
          { cards: ['9', '10', 'J', 'Q'], pointsOfFaces: 15 },
          { cards: ['10', 'J', 'Q', 'K'], pointsOfFaces: 19 },
          { cards: ['J', 'Q', 'K', 'A'], pointsOfFaces: 20 },
        ];

        combinations.forEach(({ cards, pointsOfFaces }) => {
          const { points, honor } = PointsOfTrick(
            {
              '0': Card(HEARTS, cards[0]),
              '1': Card(HEARTS, cards[1]),
              '2': Card(HEARTS, cards[2]),
              '3': Card(HEARTS, cards[3]),
            },
            trump
          );

          expect(points + honor).toEqual(50 + pointsOfFaces);
        });
      });

      it('gives honor for four consecutive cards of the same suit + stuk', () => {
        const combinations = [
          { cards: ['10', 'J', 'Q', 'K'], pointsOfFaces: 37 },
          { cards: ['J', 'Q', 'K', 'A'], pointsOfFaces: 38 },
        ];

        combinations.forEach(({ cards, pointsOfFaces }) => {
          const { points, honor } = PointsOfTrick(
            {
              '0': Card(SPADES, cards[0]),
              '1': Card(SPADES, cards[1]),
              '2': Card(SPADES, cards[2]),
              '3': Card(SPADES, cards[3]),
            },
            trump
          );

          expect(points + honor).toEqual(20 + 50 + pointsOfFaces);
        });
      });

      it('gives honor when playing four of the same faces', () => {
        const faces = [
          { face: '7', pointsOfFaces: 0 },
          { face: '8', pointsOfFaces: 0 },
          { face: '9', pointsOfFaces: 14 },
          { face: '10', pointsOfFaces: 40 },
          { face: 'J', pointsOfFaces: 26 },
          { face: 'Q', pointsOfFaces: 12 },
          { face: 'K', pointsOfFaces: 16 },
          { face: 'A', pointsOfFaces: 44 },
        ];

        faces.forEach(({ face, pointsOfFaces }) => {
          const { points, honor } = PointsOfTrick(
            {
              '0': Card(SPADES, face),
              '1': Card(HEARTS, face),
              '2': Card(DIAMONDS, face),
              '3': Card(CLUBS, face),
            },
            trump
          );

          expect(points + honor).toEqual(100 + pointsOfFaces);
        });
      });
    });
  });
});

describe('Points earned from playing a hand', () => {
  it('Gives points for the last trick, "laatste slag"', () => {
    const tricks = [
      { winner: 0, points: 4 * 11, honor: 0 },
      { winner: 0, points: 4 * 10, honor: 0 },
      { winner: 0, points: 4 * 4, honor: 0 },
      { winner: 0, points: 4 * 3, honor: 0 },
      { winner: 0, points: 4 * 2, honor: 0 },
      { winner: 1, points: 0, honor: 0 },
      { winner: 1, points: 0, honor: 0 },
      { winner: 1, points: 0, honor: 0 },
    ];

    const { wij, zij } = pointsFromHands({
      playedTricks: tricks,
      bid: {
        highestBidBy: 0,
        bid: 100,
      },
    });

    expect(wij).toEqual(120);

    // Zij only got the last four tricks inlduing the last trick "laatste slag"
    expect(zij).toEqual(10);
  });

  it('Gives 100 extra points for a pitje', () => {
    const tricks = [
      { winner: 0, points: 4 * 11, honor: 0 },
      { winner: 0, points: 4 * 10, honor: 0 },
      { winner: 0, points: 4 * 4, honor: 0 },
      { winner: 0, points: 4 * 3, honor: 0 },
      { winner: 0, points: 4 * 2, honor: 0 },
      { winner: 0, points: 0, honor: 0 },
      { winner: 0, points: 0, honor: 0 },
      { winner: 0, points: 0, honor: 0 },
    ];

    const { wij, zij } = pointsFromHands({
      playedTricks: tricks,
      bid: {
        highestBidBy: 0,
        bid: 100,
      },
    });

    expect(wij).toEqual(230);
    expect(zij).toEqual(0);
  });

  it('Gives all points to the other team is a team went wet', () => {
    const tricks = [
      { winner: 0, points: 4 * 11, honor: 0 },
      { winner: 1, points: 4 * 10, honor: 0 },
      { winner: 0, points: 4 * 4, honor: 0 },
      { winner: 0, points: 4 * 3, honor: 0 },
      { winner: 0, points: 4 * 2, honor: 0 },
      { winner: 0, points: 0, honor: 0 },
      { winner: 0, points: 0, honor: 0 },
      { winner: 0, points: 0, honor: 0 },
    ];

    const { wij, zij } = pointsFromHands({
      playedTricks: tricks,
      bid: {
        highestBidBy: 0,
        bid: 120,
      },
    });

    expect(wij).toEqual(0);
    // Zij get all points including the last trick
    expect(zij).toEqual(130);
  });

  it('Honor counts half towards the bet', () => {
    const tricks = [
      { winner: 0, points: 4 * 11, honor: 30 },
      { winner: 1, points: 4 * 10, honor: 0 },
      { winner: 0, points: 4 * 4, honor: 0 },
      { winner: 0, points: 4 * 3, honor: 0 },
      { winner: 0, points: 4 * 2, honor: 0 },
      { winner: 0, points: 0, honor: 0 },
      { winner: 0, points: 0, honor: 0 },
      { winner: 0, points: 0, honor: 0 },
    ];

    const { wij, zij } = pointsFromHands({
      playedTricks: tricks,
      bid: {
        highestBidBy: 0,
        bid: 120,
      },
    });

    expect(wij).toEqual(0);
    // Zij get all points including the last trick
    expect(zij).toEqual(160);
  });

  it('The other teams honor counts half towards the bet', () => {
    const tricks = [
      { winner: 0, points: 4 * 11, honor: 0 },
      { winner: 0, points: 4 * 10, honor: 0 },
      { winner: 0, points: 4 * 4, honor: 0 },
      { winner: 0, points: 4 * 3, honor: 0 },
      { winner: 0, points: 4 * 2, honor: 0 },
      { winner: 1, points: 0, honor: 30 },
      { winner: 0, points: 0, honor: 0 },
      { winner: 0, points: 0, honor: 0 },
    ];

    const { wij, zij } = pointsFromHands({
      playedTricks: tricks,
      bid: {
        highestBidBy: 0,
        bid: 130,
      },
    });

    expect(wij).toEqual(0);
    // Zij get all points including the last trick
    expect(zij).toEqual(160);
  });
});

describe('checking if a hand contains a card', () => {
  it('checks if a hand contains a card', () => {
    const hand = [
      Card(SPADES, 'J'),
      Card(HEARTS, '7'),
      Card(CLUBS, '7'),
      Card(DIAMONDS, '9'),
    ];

    expect(handContains(hand, Card(DIAMONDS, '9'))).toEqual(true);
  });

  it('checks if a hand does not contain a card', () => {
    const hand = [
      Card(SPADES, 'J'),
      Card(HEARTS, '7'),
      Card(CLUBS, '7'),
      Card(DIAMONDS, '9'),
    ];

    expect(handContains(hand, Card(DIAMONDS, '8'))).toEqual(false);
  });
});
