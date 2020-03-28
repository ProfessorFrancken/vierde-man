import { Client } from 'boardgame.io/client';
import { KlaverJassen } from 'GameLogic/Game';
import {
  handContains,
  Card,
  InitialDeck,
  SANS,
  SUITES,
  FACES
} from 'GameLogic/Card';
import _ from 'lodash';

describe('dealing hands', () => {
  it('allows to place a bid', () => {
    const KlaverJasScenario = {
      ...KlaverJassen
    };
    const client = Client({
      game: KlaverJasScenario,
      numPlayers: 4
    });

    // Place a winning bid by the third player
    client.moves.PlaceBid({ suit: SANS, bid: 70 });
    client.moves.PlaceBid({ suit: SUITES.CLUBS, bid: 80 });
    client.moves.PlaceBid({ suit: SUITES.DIAMONDS, bid: 90 });
    client.moves.PlaceBid({ suit: SUITES.CLUBS, bid: 100 });
    client.moves.Pass();
    client.moves.Pass();
    client.moves.Pass();

    const { G, ctx } = client.store.getState();

    expect(G.bids).toEqual({
      '0': { suit: null, bid: null, bidBy: 0 },
      '1': { suit: null, bid: null, bidBy: 1 },
      '2': { suit: null, bid: null, bidBy: 2 },
      '3': { suit: SUITES.CLUBS, bid: 100, bidBy: 3 }
    });

    expect(ctx.phase).toEqual('PlayTricks');
    expect(G.rounds).toEqual([]);
    expect(G.bid).toEqual({
      bid: 100,
      highestBidBy: 3,
      trump: SUITES.CLUBS
    });

    expect(G.hands[0].length).toEqual(8);
    expect(G.hands[1].length).toEqual(8);
    expect(G.hands[2].length).toEqual(8);
    expect(G.hands[3].length).toEqual(8);
  });

  it('Allows a player to bid after they pased', () => {
    const KlaverJasScenario = {
      ...KlaverJassen
    };
    const client = Client({
      game: KlaverJasScenario,
      numPlayers: 4
    });

    // Place a winning bid by the third player
    client.moves.Pass();
    client.moves.PlaceBid({ suit: SUITES.CLUBS, bid: 80 });
    client.moves.Pass();
    client.moves.Pass();

    const { G, ctx } = client.store.getState();
    expect(ctx.phase).toEqual('PlaceBids');
    expect(G.bids).toEqual({
      0: { suit: null, bid: null, bidBy: 0 },
      1: { suit: CLUBS, bid: 80, bidBy: 1 },
      2: { suit: null, bid: null, bidBy: 2 },
      3: { suit: null, bid: null, bidBy: 3 }
    });
  });

  it('allows to play a hand of Klaverjas', () => {
    const KlaverJasScenario = {
      ...KlaverJassen,
      setup: ctx => {
        const deck = InitialDeck();
        const stacks = _.chunk(deck, 8);

        return {
          deck: deck,
          hands: {
            0: stacks[0],
            1: stacks[1],
            2: stacks[2],
            3: stacks[3]
          },
          bids: {
            0: { suit: SUITES.SPADES, bid: 100 },
            1: { suit: null, bid: null, bidBy: 1 },
            2: { suit: null, bid: null, bidBy: 2 },
            3: { suit: null, bid: null, bidBy: 3 }
          },
          trump: SUITES.SPADES,
          bid: {
            bid: 100,
            trump: SUITES.SPADES,
            highestBidBy: 0
          },
          currentTrick: {
            startingPlayer: 0,
            playedCards: {
              0: undefined,
              1: undefined,
              2: undefined,
              3: undefined
            }
          },
          rounds: [],
          playedTricks: [],
          // Set the dealer to player 3 so that player 0 starts this round
          dealer: 3,
          them: 0,
          we: 0
        };
      }
    };

    const client = Client({
      game: KlaverJasScenario,
      // enhancer: applyMiddleware(logger),
      numPlayers: 4
    });

    {
      const { G, ctx } = client.store.getState();
      expect(ctx.phase).toEqual('PlayTricks');
      expect(handContains(G.hands['0'], Card(SUITES.SPADES, FACES[0]))).toEqual(
        true
      );
    }

    const playTheseHands = [
      {
        cards: [
          Card(SUITES.SPADES, '7'),
          Card(SUITES.CLUBS, '7'),
          Card(SUITES.DIAMONDS, '7'),
          Card(SUITES.HEARTS, '7')
        ],
        points: 0,
        honor: 100,
        winner: 0
      },
      {
        cards: [
          Card(SUITES.SPADES, '8'),
          Card(SUITES.CLUBS, '8'),
          Card(SUITES.DIAMONDS, '8'),
          Card(SUITES.HEARTS, '8')
        ],
        points: 0,
        honor: 100,
        winner: 0
      },
      {
        cards: [
          Card(SUITES.SPADES, '9'),
          Card(SUITES.CLUBS, '9'),
          Card(SUITES.DIAMONDS, '9'),
          Card(SUITES.HEARTS, '9')
        ],
        points: 14,
        honor: 100,
        winner: 0
      },
      {
        cards: [
          Card(SUITES.SPADES, '10'),
          Card(SUITES.CLUBS, '10'),
          Card(SUITES.DIAMONDS, '10'),
          Card(SUITES.HEARTS, '10')
        ],
        points: 40,
        honor: 100,
        winner: 0
      },
      {
        cards: [
          Card(SUITES.SPADES, 'J'),
          Card(SUITES.CLUBS, 'J'),
          Card(SUITES.DIAMONDS, 'J'),
          Card(SUITES.HEARTS, 'J')
        ],
        points: 26,
        honor: 100,
        winner: 0
      },
      {
        cards: [
          Card(SUITES.SPADES, 'Q'),
          Card(SUITES.CLUBS, 'Q'),
          Card(SUITES.DIAMONDS, 'Q'),
          Card(SUITES.HEARTS, 'Q')
        ],
        points: 12,
        honor: 100,
        winner: 0
      },
      {
        cards: [
          Card(SUITES.SPADES, 'K'),
          Card(SUITES.CLUBS, 'K'),
          Card(SUITES.DIAMONDS, 'K'),
          Card(SUITES.HEARTS, 'K')
        ],
        points: 16,
        honor: 100,
        winner: 0
      },
      {
        cards: [
          Card(SUITES.SPADES, 'A'),
          Card(SUITES.CLUBS, 'A'),
          Card(SUITES.DIAMONDS, 'A'),
          Card(SUITES.HEARTS, 'A')
        ],
        points: 44,
        honor: 100,
        winner: 0
      }
    ];

    for (let round = 0; round < 8; round++) {
      {
        const { G, ctx } = client.store.getState();
        expect(
          handContains(G.hands['0'], Card(SUITES.SPADES, FACES[round]))
        ).toEqual(true);

        expect(G.hands['0'].length).toEqual(8 - round);
        expect(G.hands['1'].length).toEqual(8 - round);
        expect(G.hands['2'].length).toEqual(8 - round);
        expect(G.hands['3'].length).toEqual(8 - round);
      }

      client.moves.PlayCard(playTheseHands[round].cards[0]);
      client.moves.PlayCard(playTheseHands[round].cards[1]);
      client.moves.PlayCard(playTheseHands[round].cards[2]);
      client.moves.PlayCard(playTheseHands[round].cards[3]);

      {
        const { G, ctx } = client.store.getState();
        if (round < 7) {
          expect(ctx.phase).toEqual('PlayTricks');
          expect(G.playedTricks[round]).toEqual({
            winner: playTheseHands[round].winner,
            points: playTheseHands[round].points,
            honor: 100,
            cards: [
              playTheseHands[round].cards[0],
              playTheseHands[round].cards[1],
              playTheseHands[round].cards[2],
              playTheseHands[round].cards[3]
            ]
          });
          expect(
            handContains(G.hands['0'], Card(SUITES.SPADES, FACES[round]))
          ).toEqual(false);
          expect(G.playedTricks.length).toEqual(round + 1);
        }
      }
    }

    return;
  });

  it('plays a game of klaverjas', () => {
    const KlaverJasScenario = {
      ...KlaverJassen
    };
    const client = Client({
      game: KlaverJasScenario,
      numPlayers: 4
    });

    let hands;

    for (let handsPlayed = 0; handsPlayed < 16; handsPlayed++) {
      client.moves.PlaceBid({ suit: SANS, bid: 70 });
      client.moves.Pass();
      client.moves.Pass();
      client.moves.Pass();

      {
        const { G, ctx } = client.store.getState();

        const deck = InitialDeck();
        const stacks = _.chunk(deck, 8);

        G.hands[0] = stacks[0];
        G.hands[1] = stacks[1];
        G.hands[2] = stacks[2];
        G.hands[3] = stacks[3];

        expect(ctx.phase).toEqual('PlayTricks');
        hands = G.hands;
      }

      const these = {
        '0': [
          { suit: 'S', face: '7' },
          { suit: 'S', face: '8' },
          { suit: 'S', face: '9' },
          { suit: 'S', face: '10' },
          { suit: 'S', face: 'J' },
          { suit: 'S', face: 'Q' },
          { suit: 'S', face: 'K' },
          { suit: 'S', face: 'A' }
        ],
        '1': [
          { suit: 'C', face: '7' },
          { suit: 'C', face: '8' },
          { suit: 'C', face: '9' },
          { suit: 'C', face: '10' },
          { suit: 'C', face: 'J' },
          { suit: 'C', face: 'Q' },
          { suit: 'C', face: 'K' },
          { suit: 'C', face: 'A' }
        ],
        '2': [
          { suit: 'D', face: '7' },
          { suit: 'D', face: '8' },
          { suit: 'D', face: '9' },
          { suit: 'D', face: '10' },
          { suit: 'D', face: 'J' },
          { suit: 'D', face: 'Q' },
          { suit: 'D', face: 'K' },
          { suit: 'D', face: 'A' }
        ],
        '3': [
          { suit: 'H', face: '7' },
          { suit: 'H', face: '8' },
          { suit: 'H', face: '9' },
          { suit: 'H', face: '10' },
          { suit: 'H', face: 'J' },
          { suit: 'H', face: 'Q' },
          { suit: 'H', face: 'K' },
          { suit: 'H', face: 'A' }
        ]
      };
      for (let round = 0; round < 8; round++) {
        if (handsPlayed % 4 === 0) {
          client.moves.PlayCard(these['0'][round]);
          client.moves.PlayCard(these['1'][round]);
          client.moves.PlayCard(these['2'][round]);
          client.moves.PlayCard(these['3'][round]);
        }
        if (handsPlayed % 4 === 1) {
          client.moves.PlayCard(these['1'][round]);
          client.moves.PlayCard(these['2'][round]);
          client.moves.PlayCard(these['3'][round]);
          client.moves.PlayCard(these['0'][round]);
        }
        if (handsPlayed % 4 === 2) {
          client.moves.PlayCard(these['2'][round]);
          client.moves.PlayCard(these['3'][round]);
          client.moves.PlayCard(these['0'][round]);
          client.moves.PlayCard(these['1'][round]);
        }
        if (handsPlayed % 4 === 3) {
          client.moves.PlayCard(these['3'][round]);
          client.moves.PlayCard(these['0'][round]);
          client.moves.PlayCard(these['1'][round]);
          client.moves.PlayCard(these['2'][round]);
        }

        {
          const { G, ctx } = client.store.getState();
          if (round < 7) {
            expect(ctx.phase).toEqual('PlayTricks');
            expect(G.playedTricks.length).toEqual(round + 1);
          }
        }
      }

      {
        const { G, ctx } = client.store.getState();
        if (handsPlayed < 15) {
          expect(ctx.phase).toEqual('PlaceBids');
        } else {
          expect(ctx.phase).toEqual(null);
        }
      }
    }

    {
      const { G, ctx } = client.store.getState();
      expect(ctx.gameover).toEqual({
        winner: 'Wij & Zij',
        wij: 8240,
        zij: 8240
      });
      // console.log(G, ctx);
    }
  });

  xit('deals a hand and continues to the  bidding phase', () => {});

  xit('... round robin style the dealer each time', () => {});
});

describe('technical things', () => {
  xit('does not allow players to see each other hands', () => {
    // use playerView
    // https://boardgame.io/documentation/#/api/Game
  });
});
