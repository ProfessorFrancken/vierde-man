import { INVALID_MOVE } from 'boardgame.io/core';
import { SUITES, Card } from 'GameLogic/Card';
import {
  PlayCard,
  PlayerToStartCurrentTrick
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
        { dealer: 3, expectedPlayer: 0 }
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
            playedTricks: [{ winner: 1 }, { winner: 3 }, { winner: 2 }]
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
        '3': []
      },
      bid: {
        highestBidBy: 0,
        bid: 100,
        trump: SPADES
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
          3: undefined
        }
      }
    };

    const currentPlayer = 0;
    it("allows playing a card in a player's hand", () => {
      // Arrange
      const G = {
        ...gameState,
        hands: { [currentPlayer]: [Card(SPADES, '10')] }
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
            3: Card(SPADES, '9')
          }
        }
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
            3: undefined
          }
        }
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
        hands: { [currentPlayer]: [Card(SPADES, '10')] }
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
            3: Card(SPADES, '9')
          }
        }
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
            3: Card(SPADES, '9')
          }
        }
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
            3: Card(SPADES, '9')
          }
        }
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
            3: Card(SPADES, '9')
          }
        }
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
            3: Card(SPADES, '9')
          }
        }
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
              3: Card(SPADES, '9')
            }
          }
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
              3: Card(SPADES, '9')
            }
          }
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
              3: Card(SPADES, '9')
            }
          }
        };

        // Act
        const result = PlayCard(G, { currentPlayer }, Card(SPADES, '8'));

        // Assert no card should have been played
        expect(result).toEqual(undefined);
        expect(G.hands[currentPlayer].length).toEqual(1);
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
              2: Card(HEARTS, '3'),
              3: Card(SPADES, '9')
            }
          }
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
              2: Card(HEARTS, '3'),
              3: Card(SPADES, '9')
            }
          }
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
              2: Card(HEARTS, '3'),
              3: Card(SPADES, '9')
            }
          }
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
              Card(SPADES, '7')
            ]
          },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 2,
            playedCards: {
              0: undefined,
              1: undefined,
              2: Card(HEARTS, '7'),
              3: Card(SPADES, '9')
            }
          }
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
              Card(SPADES, '7')
            ]
          },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 1,
            playedCards: {
              0: undefined,
              1: Card(HEARTS, '7'),
              2: Card(HEARTS, '9'),
              3: Card(SPADES, '9')
            }
          }
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
              Card(SPADES, '7')
            ]
          },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 1,
            playedCards: {
              0: undefined,
              1: Card(HEARTS, '7'),
              2: Card(HEARTS, '9'),
              3: Card(SPADES, '9')
            }
          }
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
              Card(SPADES, '7')
            ]
          },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 1,
            playedCards: {
              0: undefined,
              1: Card(HEARTS, '7'),
              2: Card(HEARTS, '9'),
              3: Card(DIAMONDS, '9')
            }
          }
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
              Card(SPADES, 'J')
            ]
          },
          bid: { trump: SPADES },
          currentTrick: {
            startingPlayer: 1,
            playedCards: {
              0: undefined,
              1: Card(HEARTS, '7'),
              2: Card(SPADES, '9'),
              3: Card(DIAMONDS, '9')
            }
          }
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
            Card(CLUBS, '7')
          ]
        },
        bid: { trump: CLUBS },
        currentTrick: {
          startingPlayer: 2,
          playedCards: {
            0: undefined,
            1: undefined,
            2: Card(HEARTS, '7'),
            3: Card(CLUBS, '8')
          }
        }
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
            Card(CLUBS, '7')
          ]
        },
        bid: { trump: CLUBS },
        currentTrick: {
          startingPlayer: 2,
          playedCards: {
            0: undefined,
            1: undefined,
            2: Card(HEARTS, '7'),
            3: Card(CLUBS, '8')
          }
        }
      };

      // Act
      const result = PlayCard(G, { currentPlayer: 0 }, Card(CLUBS, '10'));
      expect(result).toEqual(undefined);
    });

    describe('not being able to follow suit', () => {});
  });
});
