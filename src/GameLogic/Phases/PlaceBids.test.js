import { INVALID_MOVE } from 'boardgame.io/core';
import { SUITES, PASS, SANS } from 'GameLogic/Card';
import { PlaceBid, Pass, canPlaceBid } from 'GameLogic/Phases/PlaceBids';
import _ from 'lodash';
const { SPADES, HEARTS, CLUBS, DIAMONDS } = SUITES;

describe('bidding phase', () => {
  xit('deals a piquet deck', () => {
    const G = { hands: {}, deck: [] };
  });

  const initialGame = {
    bid: {
      bids: [],
      highestBidBy: undefined,
      bid: undefined,
      trump: undefined
    },
    bids: []
  };

  describe('rotating the dealer', () => {
    it('player 3 is dealer', () => {
      const G = { ..._.cloneDeep(initialGame), dealer: 3 };
      PlaceBid(G, { currentPlayer: 0 }, { suit: SANS, bid: 70 });
      Pass(G, { currentPlayer: 1 });
      Pass(G, { currentPlayer: 2 });
      Pass(G, { currentPlayer: 3 });

      expect(G.bids).toEqual([
        { suit: SANS, bid: 70, bidBy: 0 },
        { suit: null, bid: null, bidBy: 1 },
        { suit: null, bid: null, bidBy: 2 },
        { suit: null, bid: null, bidBy: 3 }
      ]);
    });

    it('player 0 is dealer', () => {
      const G = { ..._.cloneDeep(initialGame), dealer: 0 };
      PlaceBid(G, { currentPlayer: 1 }, { suit: SANS, bid: 70 });
      Pass(G, { currentPlayer: 2 });
      Pass(G, { currentPlayer: 3 });
      Pass(G, { currentPlayer: 0 });

      expect(G.bids).toEqual([
        { suit: SANS, bid: 70, bidBy: 1 },
        { suit: null, bid: null, bidBy: 2 },
        { suit: null, bid: null, bidBy: 3 },
        { suit: null, bid: null, bidBy: 0 }
      ]);
    });

    it('player 1 is dealer', () => {
      const G = { ..._.cloneDeep(initialGame), dealer: 1 };
      PlaceBid(G, { currentPlayer: 2 }, { suit: SANS, bid: 70 });
      Pass(G, { currentPlayer: 3 });
      Pass(G, { currentPlayer: 0 });
      Pass(G, { currentPlayer: 1 });

      expect(G.bids).toEqual([
        { suit: SANS, bid: 70, bidBy: 2 },
        { suit: null, bid: null, bidBy: 3 },
        { suit: null, bid: null, bidBy: 0 },
        { suit: null, bid: null, bidBy: 1 }
      ]);
    });

    it('player 2 is dealer', () => {
      const G = { ..._.cloneDeep(initialGame), dealer: 2 };
      PlaceBid(G, { currentPlayer: 3 }, { suit: SANS, bid: 70 });
      Pass(G, { currentPlayer: 0 });
      Pass(G, { currentPlayer: 1 });
      Pass(G, { currentPlayer: 2 });

      expect(G.bids).toEqual([
        { suit: SANS, bid: 70, bidBy: 3 },
        { suit: null, bid: null, bidBy: 0 },
        { suit: null, bid: null, bidBy: 1 },
        { suit: null, bid: null, bidBy: 2 }
      ]);
    });
  });

  it('should place a bid for the current player', () => {
    const G = { ..._.cloneDeep(initialGame), dealer: 3 };
    const result = PlaceBid(G, { currentPlayer: 0 }, { suit: SANS, bid: 70 });

    expect(result).toEqual(undefined);
    expect(G.bids).toEqual([{ suit: SANS, bid: 70, bidBy: 0 }]);
  });

  it("when bidding on SANS we can't bid lower than 70", () => {
    const G = { ..._.cloneDeep(initialGame), dealer: 3 };
    const result = PlaceBid(G, { currentPlayer: 0 }, { suit: SANS, bid: 60 });

    expect(result).toEqual(INVALID_MOVE);
  });
  it("when not bidding on SANS we can't bid lower than 80", () => {
    const G = { ..._.cloneDeep(initialGame), dealer: 3 };
    const result = PlaceBid(
      G,
      { currentPlayer: 0 },
      { suit: DIAMONDS, bid: 70 }
    );

    expect(result).toEqual(INVALID_MOVE);
  });

  it('when not bidding on SANS we start bidding from 82', () => {
    const G = { ..._.cloneDeep(initialGame), dealer: 3 };
    const result = PlaceBid(
      G,
      { currentPlayer: 0 },
      { suit: DIAMONDS, bid: 82 }
    );

    expect(result).toEqual(undefined);
    expect(G.bids).toEqual([{ suit: DIAMONDS, bid: 82, bidBy: 0 }]);
  });

  it('Allows bidding higher until three people have passed', () => {
    const G = { ..._.cloneDeep(initialGame), dealer: 3 };
    PlaceBid(G, { currentPlayer: 0 }, { suit: DIAMONDS, bid: 82 });
    PlaceBid(G, { currentPlayer: 1 }, { suit: HEARTS, bid: 92 });
    PlaceBid(G, { currentPlayer: 2 }, { suit: DIAMONDS, bid: 102 });
    PlaceBid(G, { currentPlayer: 3 }, { suit: HEARTS, bid: 112 });
    PlaceBid(G, { currentPlayer: 0 }, { suit: DIAMONDS, bid: 122 });
    PlaceBid(G, { currentPlayer: 1 }, { suit: HEARTS, bid: 132 });
    PlaceBid(G, { currentPlayer: 2 }, { suit: DIAMONDS, bid: 142 });
    PlaceBid(G, { currentPlayer: 3 }, { suit: HEARTS, bid: 152 });
    PlaceBid(G, { currentPlayer: 0 }, { suit: DIAMONDS, bid: 162 });
    Pass(G, { currentPlayer: 1 });
    Pass(G, { currentPlayer: 2 });
    const result = Pass(G, { currentPlayer: 3 });

    expect(result).toEqual(undefined);
    expect(G.bids).toEqual([
      { suit: DIAMONDS, bid: 82, bidBy: 0 },
      { suit: HEARTS, bid: 92, bidBy: 1 },
      { suit: DIAMONDS, bid: 102, bidBy: 2 },
      { suit: HEARTS, bid: 112, bidBy: 3 },
      { suit: DIAMONDS, bid: 122, bidBy: 0 },
      { suit: HEARTS, bid: 132, bidBy: 1 },
      { suit: DIAMONDS, bid: 142, bidBy: 2 },
      { suit: HEARTS, bid: 152, bidBy: 3 },
      { suit: DIAMONDS, bid: 162, bidBy: 0 },
      { suit: null, bid: null, bidBy: 1 },
      { suit: null, bid: null, bidBy: 2 },
      { suit: null, bid: null, bidBy: 3 }
    ]);
  });

  xit('should allow the current player to pass', () => {});

  it('does not allow placing a lower bid than the current highest bid', () => {
    const G = {
      ..._.cloneDeep(initialGame),
      dealer: 2,
      bids: [{ suit: HEARTS, bid: 102, bidBy: 3 }]
    };
    const result = PlaceBid(
      G,
      { currentPlayer: 0 },
      { suit: DIAMONDS, bid: 82 }
    );

    expect(result).toEqual(INVALID_MOVE);
    expect(G.bids).toEqual([{ suit: HEARTS, bid: 102, bidBy: 3 }]);
  });

  describe('Bidding on SANS', () => {
    it('Allows bidding the same amount on SANS as the current non SANS bid', () => {
      const G = {
        ..._.cloneDeep(initialGame),
        dealer: 2,
        bids: [{ suit: HEARTS, bid: 82, bidBy: 3 }]
      };
      const result = PlaceBid(G, { currentPlayer: 0 }, { suit: SANS, bid: 80 });
      expect(result).toEqual(undefined);
      expect(G.bids[1]).toEqual({ suit: SANS, bid: 80, bidBy: 0 });
    });

    it('does not allow bidding on a non SANS suit with the same value as the current bid', () => {
      const G = {
        ..._.cloneDeep(initialGame),
        dealer: 2,
        bids: [{ suit: HEARTS, bid: 82, bidBy: 3 }]
      };
      const result = PlaceBid(
        G,
        { currentPlayer: 0 },
        { suit: DIAMONDS, bid: 82 }
      );
      expect(result).toEqual(INVALID_MOVE);

      expect(G.bids.length).toEqual(1);
      expect(G.bids[0]).toEqual({ suit: HEARTS, bid: 82, bidBy: 3 });
      expect(G.bids[1]).toEqual(undefined);
    });

    it('allows bidding 80 SANS on 80 DIAMONDS', () => {
      const G = {
        ..._.cloneDeep(initialGame),
        dealer: 2,
        bids: [{ suit: DIAMONDS, bid: 82, bidBy: 3 }]
      };
      const result = PlaceBid(G, { currentPlayer: 0 }, { suit: SANS, bid: 80 });
      expect(result).toEqual(undefined);
      expect(G.bids[1]).toEqual({ suit: SANS, bid: 80, bidBy: 0 });
    });

    it('does not allow bidding 80 SANS on 90 DIAMONDS', () => {
      const G = {
        ..._.cloneDeep(initialGame),
        dealer: 2,
        bids: [{ suit: DIAMONDS, bid: 92, bidBy: 3 }]
      };
      const result = PlaceBid(G, { currentPlayer: 0 }, { suit: SANS, bid: 80 });
      expect(result).toEqual(INVALID_MOVE);
      expect(G.bids.length).toEqual(1);
      expect(G.bids[0]).toEqual({ suit: DIAMONDS, bid: 92, bidBy: 3 });
    });

    it('does not allow bidding 80 SANS on 80 SANS', () => {
      const G = {
        ..._.cloneDeep(initialGame),
        dealer: 2,
        bids: [{ suit: SANS, bid: 80, bidBy: 3 }]
      };
      const result = PlaceBid(G, { currentPlayer: 0 }, { suit: SANS, bid: 80 });
      expect(result).toEqual(INVALID_MOVE);
      expect(G.bids.length).toEqual(1);
    });

    it('does not allow bidding 130 SANS on 130 SANS after a bid of 130 Clubs', () => {
      const G = {
        ..._.cloneDeep(initialGame),
        dealer: 2,
        bids: [
          { suit: CLUBS, bid: 132, bidBy: 2 },
          { suit: SANS, bid: 130, bidBy: 3 }
        ]
      };
      const result = PlaceBid(
        G,
        { currentPlayer: 0 },
        { suit: SANS, bid: 130 }
      );
      expect(result).toEqual(INVALID_MOVE);
      expect(G.bids.length).toEqual(2);
    });
  });

  describe('Passing a bid', () => {
    it('allows passing the initial bid', () => {
      const G = { ..._.cloneDeep(initialGame), dealer: 3 };
      const result = Pass(G, { currentPlayer: 0 });
      expect(result).toEqual(undefined);
      expect(G.bids[0]).toEqual({ suit: null, bid: null, bidBy: 0 });
    });
  });

  describe('Placing bids', () => {
    xit('starts plaing a hand after the last three players passed', () => {
      // ...
    });

    xit('starts plaing a hand someone placed a pitje + roem bid', () => {
      // The one afte the dealer starts
    });
  });
});
