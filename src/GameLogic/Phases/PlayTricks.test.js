import { INVALID_MOVE } from 'boardgame.io/core';
import { SUITES, Card } from 'GameLogic/Card';
import {
  PlayCard,
  PlayerToStartCurrentTrick,
} from 'GameLogic/Phases/PlayTricks';
import _ from 'lodash';
const { CLUBS, SPADES, HEARTS, DIAMONDS } = SUITES;

describe('playing a hand', () => {
  xit('plays a trick', () => {});
  xit('the winner of a trick starts the next trick', () => {});
  xit('gives honor', () => {});

  xdescribe('sans', () => {
    xit('gives honor', () => {});
  });
  xdescribe('trump', () => {
    xit('gives honor', () => {});
  });

  xit('counts points after playing a hand', () => {});

  describe('determining the player that starts a trick', () => {
    describe('the first trick of a hand', () => {
      [
        { dealer: 0, expectedPlayer: 1 },
        { dealer: 1, expectedPlayer: 2 },
        { dealer: 2, expectedPlayer: 3 },
        { dealer: 3, expectedPlayer: 0 },
      ].forEach(({ dealer, expectedPlayer }) => {
        it(`player ${expectedPlayer} starts if player ${dealer} is the dealer`, () => {
          const playerToStart = PlayerToStartCurrentTrick(
            { dealer, playedTricks: [] },
            { numPlayers: 4 }
          );
          expect(playerToStart).toEqual(expectedPlayer);
        });
      });
    });

    describe('based on the previous trick', () => {
      it('gives the turn to the previous winner', () => {
        const playerToStart = PlayerToStartCurrentTrick(
          { dealer: 0, playedTricks: [{ winner: 2 }] },
          { numPlayers: 4 }
        );
        expect(playerToStart).toEqual(2);
      });

      it('gives the turn to the previous winner', () => {
        const playerToStart = PlayerToStartCurrentTrick(
          {
            dealer: 0,
            playedTricks: [{ winner: 1 }, { winner: 3 }, { winner: 2 }],
          },
          { numPlayers: 4 }
        );
        expect(playerToStart).toEqual(2);
      });
    });
  });

  describe('playing a card', () => {
    const gameState = {
      // NOT important
      deck: [],

      hands: {
        '0': [Card()],
        '1': [],
        '2': [],
        '3': [],
      },
      bid: {
        highestBidBy: 0,
        bid: 100,
        trump: SPADES,
      },
      trump: SPADES,
      playedTricsk: [],
      rounds: [],
      dealer: 3,
      currentTrick: {
        startingPlayer: 0,
        playedCards: {
          0: undefined,
          1: undefined,
          2: undefined,
          3: undefined,
        },
      },
    };

    const currentPlayer = 0;
    it("allows playing a card in a player's hand", () => {
      // Arrange
      const G = {
        ...gameState,
        hands: { [currentPlayer]: [Card(SPADES, '10')] },
      };

      // Act
      const result = PlayCard(G, { currentPlayer }, Card(SPADES, '10'));

      // Assert
      expect(result).toEqual(undefined);
      expect(G.hands[currentPlayer].length).toEqual(0);
    });

    it('playing a hand after another player', () => {
      // Arrange
      const G = {
        ...gameState,
        hands: { [currentPlayer]: [Card(SPADES, '10'), Card(HEARTS, '10')] },
        bid: { trump: DIAMONDS },
        currentTrick: {
          startingPlayer: 3,
          playedCards: {
            0: undefined,
            1: undefined,
            2: undefined,
            3: { ...Card(SPADES, '9'), playedBy: 3 },
          },
        },
      };

      // Act
      const result = PlayCard(G, { currentPlayer }, Card(SPADES, '10'));

      // Assert
      expect(result).toEqual(undefined);
      expect(G.hands[currentPlayer].length).toEqual(1);
    });

    it('does not allow a nother player than the starting player to play the first card', () => {
      // Arrange
      const G = {
        ...gameState,
        hands: { [currentPlayer]: [Card(SPADES, '10')] },
        currentTrick: {
          startingPlayer: 1,
          playedCards: {
            0: undefined,
            1: undefined,
            2: undefined,
            3: undefined,
          },
        },
      };

      // Act
      const result = PlayCard(G, { currentPlayer }, Card(SPADES, '10'));

      // Assert
      expect(result).toEqual(INVALID_MOVE);
      expect(G.hands[currentPlayer].length).toEqual(1);
    });

    it("does not allow playing a card not in a player's hand", () => {
      // Arrange
      const G = {
        ...gameState,
        hands: { [currentPlayer]: [Card(SPADES, '10')] },
      };

      // Act
      const result = PlayCard(G, { currentPlayer }, Card(HEARTS, '10'));

      // Assert
      expect(result).toEqual(INVALID_MOVE);
      expect(G.hands[currentPlayer].length).toEqual(1);
    });

    it('a player must follow suit if possible', () => {
      // Arrange
      const G = {
        ...gameState,
        hands: { [currentPlayer]: [Card(SPADES, '10'), Card(HEARTS, '10')] },
        currentTrick: {
          startingPlayer: 3,
          playedCards: {
            0: undefined,
            1: undefined,
            2: undefined,
            3: { ...Card(SPADES, '9'), playedBy: 3 },
          },
        },
      };

      // Act
      const result = PlayCard(G, { currentPlayer }, Card(HEARTS, '10'));

      // Assert no card should have been played
      expect(result).toEqual(INVALID_MOVE);
      expect(G.hands[currentPlayer].length).toEqual(2);
    });

    it("a player can't trump if they can follow suit", () => {
      // Arrange
      const G = {
        ...gameState,
        hands: { [currentPlayer]: [Card(SPADES, '10'), Card(HEARTS, '10')] },
        bid: { trump: HEARTS },
        currentTrick: {
          startingPlayer: 3,
          playedCards: {
            0: undefined,
            1: undefined,
            2: undefined,
            3: { ...Card(SPADES, '9'), playedBy: 3 },
          },
        },
      };

      // Act
      const result = PlayCard(G, { currentPlayer }, Card(HEARTS, '10'));

      // Assert no card should have been played
      expect(result).toEqual(INVALID_MOVE);
      expect(G.hands[currentPlayer].length).toEqual(2);
    });

    it("a player can play a different suit, if they can't follow suit and don't have trump", () => {
      const G = {
        ...gameState,
        hands: { [currentPlayer]: [Card(HEARTS, '10')] },
        currentTrick: {
          startingPlayer: 3,
          playedCards: {
            0: undefined,
            1: undefined,
            2: undefined,
            3: { ...Card(SPADES, '9'), playedBy: 3 },
          },
        },
      };

      // Act
      const result = PlayCard(G, { currentPlayer }, Card(HEARTS, '10'));

      // Assert no card should have been played
      expect(result).toEqual(undefined);
      expect(G.hands[currentPlayer].length).toEqual(0);
    });

    it("a player can trump if it can't follow suit", () => {
      const G = {
        ...gameState,
        hands: { [currentPlayer]: [Card(HEARTS, '10'), Card(DIAMONDS, '10')] },
        bid: { trump: HEARTS },
        currentTrick: {
          startingPlayer: 3,
          playedCards: {
            0: undefined,
            1: undefined,
            2: undefined,
            3: { ...Card(SPADES, '9'), playedBy: 3 },
          },
        },
      };

      // Act
      const result = PlayCard(G, { currentPlayer }, Card(HEARTS, '10'));

      // Assert no card should have been played
      expect(result).toEqual(undefined);
      expect(G.hands[currentPlayer].length).toEqual(1);
    });

    it("a player must trump if it can't follow suit", () => {
      const G = {
        ...gameState,
        hands: { [currentPlayer]: [Card(HEARTS, '10'), Card(DIAMONDS, '10')] },
        bid: { trump: HEARTS },
        currentTrick: {
          startingPlayer: 3,
          playedCards: {
            0: undefined,
            1: undefined,
            2: undefined,
            3: { ...Card(SPADES, '9'), playedBy: 3 },
          },
        },
      };

      // Act
      const result = PlayCard(G, { currentPlayer }, Card(DIAMONDS, '10'));

      // Assert no card should have been played
      expect(result).toEqual(INVALID_MOVE);
      expect(G.hands[currentPlayer].length).toEqual(2);
    });

    describe('when the first card is trump', () => {
      it("a player can't undertrump if it can overtrump", () => {
        const G = {
          ...gameState,
          hands: { [currentPlayer]: [Card(SPADES, 'J'), Card(SPADES, '7')] },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 3,
            playedCards: {
              0: undefined,
              1: undefined,
              2: undefined,
              3: { ...Card(SPADES, '9'), playedBy: 3 },
            },
          },
        };

        // Act
        const result = PlayCard(G, { currentPlayer }, Card(SPADES, '7'));

        // Assert no card should have been played
        expect(result).toEqual(INVALID_MOVE);
        expect(G.hands[currentPlayer].length).toEqual(2);
      });

      it('a player is allowed to overtrump', () => {
        const G = {
          ...gameState,
          hands: { [currentPlayer]: [Card(SPADES, 'J'), Card(SPADES, '7')] },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 3,
            playedCards: {
              0: undefined,
              1: undefined,
              2: undefined,
              3: { ...Card(SPADES, '9'), playedBy: 3 },
            },
          },
        };

        // Act
        const result = PlayCard(G, { currentPlayer }, Card(SPADES, 'J'));

        // Assert no card should have been played
        expect(result).toEqual(undefined);
        expect(G.hands[currentPlayer].length).toEqual(1);
      });

      it('a player can undertrump if it has no higher trump cards', () => {
        const G = {
          ...gameState,
          hands: { [currentPlayer]: [Card(SPADES, '8'), Card(SPADES, '7')] },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 3,
            playedCards: {
              0: undefined,
              1: undefined,
              2: undefined,
              3: { ...Card(SPADES, '9'), playedBy: 3 },
            },
          },
        };

        // Act
        const result = PlayCard(G, { currentPlayer }, Card(SPADES, '8'));

        // Assert no card should have been played
        expect(result).toEqual(undefined);
        expect(G.hands[currentPlayer].length).toEqual(1);
      });

      it("a player can't undertrump if it has another option", () => {
        const G = {
          ...gameState,
          hands: { 1: [Card(DIAMONDS, 'J'), Card(SPADES, '7')] },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 3,
            playedCards: {
              0: { ...Card(SPADES, '9'), playedBy: 0 },
              1: undefined,
              2: undefined,
              3: { ...Card(HEARTS, '9'), playedBy: 3 },
            },
          },
        };

        // Act
        const result = PlayCard(G, { currentPlayer: 1 }, Card(SPADES, '7'));

        // Assert no card should have been played
        expect(result).toEqual(INVALID_MOVE);
        expect(G.hands[1].length).toEqual(2);
      });

      it('a player can undertrump if it has another no other choice', () => {
        const G = {
          ...gameState,
          hands: { 1: [Card(SPADES, '8'), Card(SPADES, '7')] },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 3,
            playedCards: {
              0: { ...Card(SPADES, '9'), playedBy: 0 },
              1: undefined,
              2: undefined,
              3: { ...Card(HEARTS, '9'), playedBy: 3 },
            },
          },
        };

        // Act
        const result = PlayCard(G, { currentPlayer: 1 }, Card(SPADES, '7'));

        // Assert no card should have been played
        expect(result).toEqual(undefined);
        expect(G.hands[1].length).toEqual(1);
      });
    });

    describe('when an opponent has trumped', () => {
      it("a player can't undertrump if it can overtrump", () => {
        const G = {
          ...gameState,
          hands: { [currentPlayer]: [Card(SPADES, 'J'), Card(SPADES, '7')] },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 2,
            playedCards: {
              0: undefined,
              1: undefined,
              2: { ...Card(HEARTS, '3'), playedBy: 2 },
              3: { ...Card(SPADES, '9'), playedBy: 3 },
            },
          },
        };

        // Act
        const result = PlayCard(G, { currentPlayer }, Card(SPADES, '7'));

        // Assert no card should have been played
        expect(result).toEqual(INVALID_MOVE);
        expect(G.hands[currentPlayer].length).toEqual(2);
      });

      it('a player is allowed to overtrump', () => {
        const G = {
          ...gameState,
          hands: { [currentPlayer]: [Card(SPADES, 'J'), Card(SPADES, '7')] },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 2,
            playedCards: {
              0: undefined,
              1: undefined,
              2: { ...Card(HEARTS, '3'), playedBy: 2 },
              3: { ...Card(SPADES, '9'), playedBy: 3 },
            },
          },
        };

        // Act
        const result = PlayCard(G, { currentPlayer }, Card(SPADES, 'J'));

        // Assert no card should have been played
        expect(result).toEqual(undefined);
        expect(G.hands[currentPlayer].length).toEqual(1);
      });

      it('a player can undertrump if it has no higher trump cards', () => {
        const G = {
          ...gameState,
          hands: { [currentPlayer]: [Card(SPADES, '8'), Card(SPADES, '7')] },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 2,
            playedCards: {
              0: undefined,
              1: undefined,
              2: { ...Card(HEARTS, '3'), playedBy: 2 },
              3: { ...Card(SPADES, '9'), playedBy: 3 },
            },
          },
        };

        // Act
        const result = PlayCard(G, { currentPlayer }, Card(SPADES, '8'));

        // Assert no card should have been played
        expect(result).toEqual(undefined);
        expect(G.hands[currentPlayer].length).toEqual(1);
      });

      it('a player play a different card if it has no higher trump cards', () => {
        const G = {
          ...gameState,
          hands: {
            [currentPlayer]: [
              Card(DIAMONDS, '7'),
              Card(SPADES, '8'),
              Card(SPADES, '7'),
            ],
          },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 2,
            playedCards: {
              0: undefined,
              1: undefined,
              2: { ...Card(HEARTS, '7'), playedBy: 2 },
              3: { ...Card(SPADES, '9'), playedBy: 3 },
            },
          },
        };

        // Act
        const result = PlayCard(G, { currentPlayer }, Card(DIAMONDS, '7'));

        // Assert no card should have been played
        expect(result).toEqual(undefined);
        expect(G.hands[currentPlayer].length).toEqual(2);
      });
    });

    describe('when the trick is being won by a teammate', () => {
      it('the player follow suit', () => {
        const G = {
          ...gameState,
          hands: {
            [currentPlayer]: [
              Card(DIAMONDS, '7'),
              Card(HEARTS, '8'),
              Card(SPADES, '7'),
            ],
          },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 1,
            playedCards: {
              0: undefined,
              1: { ...Card(HEARTS, '7'), playedBy: 1 },
              2: { ...Card(HEARTS, '9'), playedBy: 2 },
              3: { ...Card(SPADES, '9'), playedBy: 3 },
            },
          },
        };

        // Act
        const result = PlayCard(G, { currentPlayer }, Card(HEARTS, '8'));

        // Assert no card should have been played
        expect(result).toEqual(undefined);
        expect(G.hands[currentPlayer].length).toEqual(2);
      });

      it('the player must follow suit', () => {
        const G = {
          ...gameState,
          hands: {
            [currentPlayer]: [
              Card(DIAMONDS, '7'),
              Card(HEARTS, '8'),
              Card(SPADES, '7'),
            ],
          },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 1,
            playedCards: {
              0: undefined,
              1: { ...Card(HEARTS, '7'), playedBy: 1 },
              2: { ...Card(HEARTS, '9'), playedBy: 2 },
              3: { ...Card(SPADES, '9'), playedBy: 3 },
            },
          },
        };

        // Act
        const result = PlayCard(G, { currentPlayer }, Card(SPADES, '7'));

        // Assert no card should have been played
        expect(result).toEqual(INVALID_MOVE);
        expect(G.hands[currentPlayer].length).toEqual(3);
      });

      it("the player can trump if they can't follow suit", () => {
        const G = {
          ...gameState,
          hands: {
            [currentPlayer]: [
              Card(DIAMONDS, '7'),
              Card(SPADES, '8'),
              Card(SPADES, '7'),
            ],
          },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 1,
            playedCards: {
              0: undefined,
              1: { ...Card(HEARTS, '7'), playedBy: 1 },
              2: { ...Card(HEARTS, '9'), playedBy: 2 },
              3: { ...Card(DIAMONDS, '9'), playedBy: 3 },
            },
          },
        };

        // Act
        const result = PlayCard(G, { currentPlayer }, Card(SPADES, '8'));

        // Assert no card should have been played
        expect(result).toEqual(undefined);
        expect(G.hands[currentPlayer].length).toEqual(2);
      });

      it("the player does not have to trump if they can't follow suit", () => {
        const G = {
          ...gameState,
          hands: {
            [currentPlayer]: [
              Card(DIAMONDS, 'A'),
              Card(DIAMONDS, '7'),
              Card(SPADES, '8'),
              Card(SPADES, 'J'),
            ],
          },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 1,
            playedCards: {
              0: undefined,
              1: { ...Card(HEARTS, '7'), playedBy: 1 },
              2: { ...Card(SPADES, '9'), playedBy: 2 },
              3: { ...Card(DIAMONDS, '9'), playedBy: 3 },
            },
          },
        };

        // Act
        const result = PlayCard(G, { currentPlayer }, Card(DIAMONDS, '7'));

        // Assert no card should have been played
        expect(result).toEqual(undefined);
        expect(G.hands[currentPlayer].length).toEqual(3);
      });
    });

    it('regression', () => {
      const G = {
        ...gameState,
        hands: {
          [currentPlayer]: [
            Card(CLUBS, '10'),
            Card(SPADES, 'K'),
            Card(SPADES, '8'),
            Card(DIAMONDS, '10'),
            Card(SPADES, 'A'),
            Card(CLUBS, '7'),
          ],
        },
        bid: { trump: CLUBS },
        currentTrick: {
          startingPlayer: 2,
          playedCards: {
            0: undefined,
            1: undefined,
            2: { ...Card(HEARTS, '7'), playedBy: 2 },
            3: { ...Card(CLUBS, '8'), playedBy: 3 },
          },
        },
      };

      // Act
      const result = PlayCard(G, { currentPlayer: 0 }, Card(CLUBS, '7'));
      expect(result).toEqual(INVALID_MOVE);
    });

    it('regression 2', () => {
      const G = {
        ...gameState,
        hands: {
          [currentPlayer]: [
            Card(CLUBS, '10'),
            Card(SPADES, 'K'),
            Card(SPADES, '8'),
            Card(DIAMONDS, '10'),
            Card(SPADES, 'A'),
            Card(CLUBS, '7'),
          ],
        },
        bid: { trump: CLUBS },
        currentTrick: {
          startingPlayer: 2,
          playedCards: {
            0: undefined,
            1: undefined,
            2: { ...Card(HEARTS, '7'), playedBy: 2 },
            3: { ...Card(CLUBS, '8'), playedBy: 3 },
          },
        },
      };

      // Act
      const result = PlayCard(G, { currentPlayer: 0 }, Card(CLUBS, '10'));
      expect(result).toEqual(undefined);
    });

    it('regression 3', () => {
      const G_reg = {
        deck: [
          { suit: 'H', face: 'A' },
          { suit: 'H', face: '7' },
          { suit: 'C', face: '8' },
          { suit: 'D', face: 'K' },
          { suit: 'C', face: 'A' },
          { suit: 'D', face: 'J' },
          { suit: 'H', face: 'K' },
          { suit: 'D', face: '7' },
          { suit: 'S', face: '7' },
          { suit: 'C', face: '7' },
          { suit: 'C', face: 'K' },
          { suit: 'D', face: 'Q' },
          { suit: 'H', face: '9' },
          { suit: 'C', face: 'J' },
          { suit: 'H', face: 'Q' },
          { suit: 'S', face: '10' },
          { suit: 'C', face: '10' },
          { suit: 'H', face: '8' },
          { suit: 'S', face: '8' },
          { suit: 'D', face: '10' },
          { suit: 'S', face: 'Q' },
          { suit: 'H', face: 'J' },
          { suit: 'D', face: 'A' },
          { suit: 'C', face: '9' },
          { suit: 'S', face: '9' },
          { suit: 'S', face: 'J' },
          { suit: 'H', face: '10' },
          { suit: 'S', face: 'A' },
          { suit: 'C', face: 'Q' },
          { suit: 'S', face: 'K' },
          { suit: 'D', face: '8' },
          { suit: 'D', face: '9' },
        ],
        rounds: [],
        playedTricks: [
          {
            winner: 2,
            points: 18,
            honor: 20,
            cards: [
              { suit: 'D', face: 'K', playedBy: 0 },
              { suit: 'D', face: 'Q', playedBy: 1 },
              { suit: 'D', face: 'A', playedBy: 2 },
              { suit: 'D', face: '9', playedBy: 3 },
            ],
          },
          {
            winner: 1,
            points: 12,
            honor: 0,
            cards: [
              { suit: 'D', face: 'J', playedBy: 0 },
              { suit: 'C', face: '7', playedBy: 1 },
              { suit: 'D', face: '10', playedBy: 2 },
              { suit: 'D', face: '8', playedBy: 3 },
            ],
          },
          {
            winner: 0,
            points: 4,
            honor: 0,
            cards: [
              { suit: 'C', face: '8', playedBy: 0 },
              { suit: 'S', face: '7', playedBy: 1 },
              { suit: 'S', face: '8', playedBy: 2 },
              { suit: 'S', face: 'K', playedBy: 3 },
            ],
          },
        ],
        bid: { highestBidBy: 0, bid: 80, trump: 'C' },
        bids: [
          { suit: 'C', bid: 80, bidBy: 0 },
          { bid: null, suit: null, bidBy: 1 },
          { bid: null, suit: null, bidBy: 2 },
          { bid: null, suit: null, bidBy: 3 },
        ],
        currentTrick: {
          startingPlayer: 0,
          playedCards: {
            '0': { suit: 'D', face: '7', playedBy: 0 },
          },
        },
        dealer: 3,
        wij: 0,
        zij: 0,
        hands: {
          '0': [
            { suit: 'H', face: 'A' },
            { suit: 'H', face: '7' },
            { suit: 'C', face: 'A' },
            { suit: 'H', face: 'K' },
          ],
          '1': [
            { suit: 'C', face: 'K' },
            { suit: 'H', face: '9' },
            { suit: 'C', face: 'J' },
            { suit: 'H', face: 'Q' },
            { suit: 'S', face: '10' },
          ],
          '2': [
            { suit: 'C', face: '10' },
            { suit: 'H', face: '8' },
            { suit: 'S', face: 'Q' },
            { suit: 'H', face: 'J' },
            { suit: 'C', face: '9' },
          ],
          '3': [
            { suit: 'S', face: '9' },
            { suit: 'S', face: 'J' },
            { suit: 'H', face: '10' },
            { suit: 'S', face: 'A' },
            { suit: 'C', face: 'Q' },
          ],
        },
      };
      const G = {
        ...G_reg,

        // hands: {
        //   '1': [
        //     { suit: 'C', face: '10' },
        //     { suit: 'C', face: 'K' },
        //     { suit: 'H', face: '9' },
        //     { suit: 'C', face: 'J' },
        //     { suit: 'H', face: 'Q' }
        //   ]
        // },

        // hands: {
        //   '0': [
        //     { suit: 'H', face: 'A' },
        //     { suit: 'H', face: '7' },
        //     { suit: 'C', face: 'A' },
        //     { suit: 'H', face: 'K' }
        //   ],
        //   '1': [
        //     { suit: 'S', face: '10' },
        //     { suit: 'C', face: 'K' },
        //     { suit: 'H', face: '9' },
        //     { suit: 'C', face: 'J' },
        //     { suit: 'H', face: 'Q' }
        //   ],
        //   // '1': [
        //   //   { suit: 'C', face: 'K' },
        //   //   { suit: 'H', face: '9' },
        //   //   { suit: 'C', face: 'J' },
        //   //   { suit: 'H', face: 'Q' },
        //   //   { suit: 'S', face: '10' }
        //   // ],
        //   '2': [
        //     { suit: 'C', face: '10' },
        //     { suit: 'H', face: '8' },
        //     { suit: 'S', face: 'Q' },
        //     { suit: 'H', face: 'J' },
        //     { suit: 'C', face: '9' }
        //   ],
        //   '3': [
        //     { suit: 'S', face: '9' },
        //     { suit: 'S', face: 'J' },
        //     { suit: 'H', face: '10' },
        //     { suit: 'S', face: 'A' },
        //     { suit: 'C', face: 'Q' }
        //   ]
        // }
        // bid: { trump: CLUBS },
        // currentTrick: {
        //   startingPlayer: 0,
        //   playedCards: {
        //     '0': { suit: 'D', face: '7', playedBy: 0 }
        //   }
        // },
        // dealer: 3,
        // wij: 0,
        // zij: 0,
        // playedTricks: [
        //   {
        //     winner: 2,
        //     points: 18,
        //     honor: 20,
        //     cards: [
        //       { suit: 'D', face: 'K', playedBy: 0 },
        //       { suit: 'D', face: 'Q', playedBy: 1 },
        //       { suit: 'D', face: 'A', playedBy: 2 },
        //       { suit: 'D', face: '9', playedBy: 3 }
        //     ]
        //   },
        //   {
        //     winner: 1,
        //     points: 12,
        //     honor: 0,
        //     cards: [
        //       { suit: 'D', face: 'J', playedBy: 0 },
        //       { suit: 'C', face: '7', playedBy: 1 },
        //       { suit: 'D', face: '10', playedBy: 2 },
        //       { suit: 'D', face: '8', playedBy: 3 }
        //     ]
        //   },
        //   {
        //     winner: 0,
        //     points: 4,
        //     honor: 0,
        //     cards: [
        //       { suit: 'C', face: '8', playedBy: 0 },
        //       { suit: 'S', face: '7', playedBy: 1 },
        //       { suit: 'S', face: '8', playedBy: 2 },
        //       { suit: 'S', face: 'K', playedBy: 3 }
        //     ]
        //   }
        // ]
        // currentTrick: {
        //   startingPlayer: 0,
        //   playedCards: [{ ...Card(DIAMONDS, '7'), playedBy: 0 }]
        // }
      };

      // Act
      const result = PlayCard(G, { currentPlayer: 1 }, Card(SPADES, '10'));
      expect(result).toEqual(INVALID_MOVE);
    });

    it('regression 4', () => {
      const G_reg = {
        deck: [
          { suit: 'S', face: 'J' },
          { suit: 'C', face: '10' },
          { suit: 'H', face: '7' },
          { suit: 'S', face: 'A' },
          { suit: 'H', face: 'A' },
          { suit: 'S', face: '9' },
          { suit: 'H', face: '10' },
          { suit: 'C', face: '7' },
          { suit: 'H', face: '9' },
          { suit: 'S', face: 'K' },
          { suit: 'C', face: 'K' },
          { suit: 'D', face: '10' },
          { suit: 'D', face: 'Q' },
          { suit: 'S', face: '8' },
          { suit: 'D', face: 'J' },
          { suit: 'D', face: 'A' },
          { suit: 'D', face: '9' },
          { suit: 'S', face: 'Q' },
          { suit: 'C', face: '8' },
          { suit: 'D', face: 'K' },
          { suit: 'D', face: '7' },
          { suit: 'S', face: '7' },
          { suit: 'C', face: '9' },
          { suit: 'C', face: 'Q' },
          { suit: 'S', face: '10' },
          { suit: 'C', face: 'A' },
          { suit: 'D', face: '8' },
          { suit: 'H', face: '8' },
          { suit: 'H', face: 'Q' },
          { suit: 'H', face: 'K' },
          { suit: 'C', face: 'J' },
          { suit: 'H', face: 'J' },
        ],
        rounds: [],
        playedTricks: [
          {
            winner: 0,
            points: 28,
            honor: 20,
            cards: [
              { suit: 'S', face: 'A', playedBy: 0 },
              { suit: 'S', face: 'K', playedBy: 1 },
              { suit: 'S', face: 'Q', playedBy: 2 },
              { suit: 'S', face: '10', playedBy: 3 },
            ],
          },
        ],
        bid: { highestBidBy: 0, bid: 80, trump: 'C' },
        bids: [
          { suit: 'C', bid: 80, bidBy: 0 },
          { bid: null, suit: null, bidBy: 1 },
          { bid: null, suit: null, bidBy: 2 },
          { bid: null, suit: null, bidBy: 3 },
        ],
        currentTrick: {
          startingPlayer: 0,
          playedCards: {
            '0': { suit: 'S', face: '9', playedBy: 0 },
            '1': { suit: 'S', face: '8', playedBy: 1 },
            '2': { suit: 'S', face: '7', playedBy: 2 },
          },
        },
        dealer: 3,
        wij: 0,
        zij: 0,
        hands: {
          '0': [
            { suit: 'S', face: 'J' },
            { suit: 'C', face: '10' },
            { suit: 'H', face: '7' },
            { suit: 'H', face: 'A' },
            { suit: 'H', face: '10' },
            { suit: 'C', face: '7' },
          ],
          '1': [
            { suit: 'H', face: '9' },
            { suit: 'C', face: 'K' },
            { suit: 'D', face: '10' },
            { suit: 'D', face: 'Q' },
            { suit: 'D', face: 'J' },
            { suit: 'D', face: 'A' },
          ],
          '2': [
            { suit: 'D', face: '9' },
            { suit: 'C', face: '8' },
            { suit: 'D', face: 'K' },
            { suit: 'D', face: '7' },
            { suit: 'C', face: '9' },
            { suit: 'C', face: 'Q' },
          ],
          '3': [
            { suit: 'C', face: 'A' },
            { suit: 'D', face: '8' },
            { suit: 'H', face: '8' },
            { suit: 'H', face: 'Q' },
            { suit: 'H', face: 'K' },
            { suit: 'C', face: 'J' },
            { suit: 'H', face: 'J' },
          ],
        },
      };

      const G = { ...G_reg };

      // Act
      const result = PlayCard(G, { currentPlayer: 3 }, Card(DIAMONDS, '8'));
      expect(result).toEqual(INVALID_MOVE);
    });

    describe('not being able to follow suit', () => {});
  });
});
