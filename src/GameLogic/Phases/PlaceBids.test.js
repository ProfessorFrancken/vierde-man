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
      bids: {
        0: undefined,
        1: undefined,
        2: undefined,
        3: undefined
      },
      highestBidBy: undefined,
      bid: undefined,
      trump: undefined
    },
    bids: {
      0: undefined,
      1: undefined,
      2: undefined,
      3: undefined
    }
  };

  describe('rotating the dealer', () => {
    it('player 3 is dealer', () => {
      const G = { ..._.cloneDeep(initialGame), dealer: 3 };
      PlaceBid(G, { currentPlayer: 0 }, { suit: SANS, bid: 70 });
      Pass(G, { currentPlayer: 1 });
      Pass(G, { currentPlayer: 2 });
      Pass(G, { currentPlayer: 3 });

      expect(G.bids).toEqual({
        0: { suit: SANS, bid: 70, bidBy: 0 },
        1: { suit: null, bid: null, bidBy: 1 },
        2: { suit: null, bid: null, bidBy: 2 },
        3: { suit: null, bid: null, bidBy: 3 }
      });
    });

    it('player 0 is dealer', () => {
      const G = { ..._.cloneDeep(initialGame), dealer: 0 };
      PlaceBid(G, { currentPlayer: 1 }, { suit: SANS, bid: 70 });
      Pass(G, { currentPlayer: 2 });
      Pass(G, { currentPlayer: 3 });
      Pass(G, { currentPlayer: 0 });

      expect(G.bids).toEqual({
        0: { suit: null, bid: null, bidBy: 0 },
        1: { suit: SANS, bid: 70, bidBy: 1 },
        2: { suit: null, bid: null, bidBy: 2 },
        3: { suit: null, bid: null, bidBy: 3 }
      });
    });

    it('player 1 is dealer', () => {
      const G = { ..._.cloneDeep(initialGame), dealer: 1 };
      PlaceBid(G, { currentPlayer: 2 }, { suit: SANS, bid: 70 });
      Pass(G, { currentPlayer: 3 });
      Pass(G, { currentPlayer: 0 });
      Pass(G, { currentPlayer: 1 });

      expect(G.bids).toEqual({
        0: { suit: null, bid: null, bidBy: 0 },
        1: { suit: null, bid: null, bidBy: 1 },
        2: { suit: SANS, bid: 70, bidBy: 2 },
        3: { suit: null, bid: null, bidBy: 3 }
      });
    });

    it('player 2 is dealer', () => {
      const G = { ..._.cloneDeep(initialGame), dealer: 2 };
      PlaceBid(G, { currentPlayer: 3 }, { suit: SANS, bid: 70 });
      Pass(G, { currentPlayer: 0 });
      Pass(G, { currentPlayer: 1 });
      Pass(G, { currentPlayer: 2 });

      expect(G.bids).toEqual({
        0: { suit: null, bid: null, bidBy: 0 },
        1: { suit: null, bid: null, bidBy: 1 },
        2: { suit: null, bid: null, bidBy: 2 },
        3: { suit: SANS, bid: 70, bidBy: 3 }
      });
    });
  });

  it('should place a bid for the current player', () => {
    const G = { ..._.cloneDeep(initialGame), dealer: 3 };
    const result = PlaceBid(G, { currentPlayer: 0 }, { suit: SANS, bid: 70 });

    expect(result).toEqual(undefined);
    expect(G.bids).toEqual({
      0: { suit: SANS, bid: 70, bidBy: 0 },
      1: undefined,
      2: undefined,
      3: undefined
    });
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

  it('when not bidding on SANS we start bidding from 80', () => {
    const G = { ..._.cloneDeep(initialGame), dealer: 3 };
    const result = PlaceBid(
      G,
      { currentPlayer: 0 },
      { suit: DIAMONDS, bid: 80 }
    );

    expect(result).toEqual(undefined);
    expect(G.bids).toEqual({
      0: { suit: DIAMONDS, bid: 80, bidBy: 0 },
      1: undefined,
      2: undefined,
      3: undefined
    });
  });

  it('Allows bidding higher until three people have passed', () => {
    const G = { ..._.cloneDeep(initialGame), dealer: 3 };
    PlaceBid(G, { currentPlayer: 0 }, { suit: DIAMONDS, bid: 80 });
    PlaceBid(G, { currentPlayer: 1 }, { suit: HEARTS, bid: 90 });
    PlaceBid(G, { currentPlayer: 2 }, { suit: DIAMONDS, bid: 100 });
    PlaceBid(G, { currentPlayer: 3 }, { suit: HEARTS, bid: 110 });
    PlaceBid(G, { currentPlayer: 0 }, { suit: DIAMONDS, bid: 120 });
    PlaceBid(G, { currentPlayer: 1 }, { suit: HEARTS, bid: 130 });
    PlaceBid(G, { currentPlayer: 2 }, { suit: DIAMONDS, bid: 140 });
    PlaceBid(G, { currentPlayer: 3 }, { suit: HEARTS, bid: 150 });
    PlaceBid(G, { currentPlayer: 0 }, { suit: DIAMONDS, bid: 160 });
    Pass(G, { currentPlayer: 1 });
    Pass(G, { currentPlayer: 2 });
    const result = Pass(G, { currentPlayer: 3 });

    expect(result).toEqual(undefined);
    expect(G.bids).toEqual({
      0: { suit: DIAMONDS, bid: 160, bidBy: 0 },
      1: { suit: null, bid: null, bidBy: 1 },
      2: { suit: null, bid: null, bidBy: 2 },
      3: { suit: null, bid: null, bidBy: 3 }
    });
  });

  xit('should allow the current player to pass', () => {});

  it('does not allow placing a lower bid than the current highest bid', () => {
    const G = {
      ..._.cloneDeep(initialGame),
      dealer: 2,
      bids: {
        0: undefined,
        1: undefined,
        2: undefined,
        3: { suit: HEARTS, bid: 100, bidBy: 3 }
      }
    };
    const result = PlaceBid(
      G,
      { currentPlayer: 0 },
      { suit: DIAMONDS, bid: 80 }
    );

    expect(result).toEqual(INVALID_MOVE);
    expect(G.bids).toEqual({
      0: undefined,
      1: undefined,
      2: undefined,
      3: { suit: HEARTS, bid: 100, bidBy: 3 }
    });
  });

  describe('Bidding on SANS', () => {
    it('Allows bidding the same amount on SANS as the current non SANS bid', () => {
      const G = {
        ..._.cloneDeep(initialGame),
        dealer: 2,
        bids: {
          0: undefined,
          1: undefined,
          2: undefined,
          3: { suit: HEARTS, bid: 80, bidBy: 3 }
        }
      };
      const result = PlaceBid(G, { currentPlayer: 0 }, { suit: SANS, bid: 80 });
      expect(result).toEqual(undefined);
      expect(G.bids[0]).toEqual({ suit: SANS, bid: 80, bidBy: 0 });
    });

    it('does not allow bidding on a non SANS suit with the same value as the current bid', () => {
      const G = {
        ..._.cloneDeep(initialGame),
        dealer: 2,
        bids: {
          0: undefined,
          1: undefined,
          2: undefined,
          3: { suit: HEARTS, bid: 80, bidBy: 3 }
        }
      };
      const result = PlaceBid(
        G,
        { currentPlayer: 0 },
        { suit: DIAMONDS, bid: 80 }
      );
      expect(result).toEqual(INVALID_MOVE);
      expect(G.bids[0]).toEqual(undefined);
    });

    it('allows bidding 80 SANS on 80 DIAMONDS', () => {
      const G = {
        ..._.cloneDeep(initialGame),
        dealer: 2,
        bids: {
          0: undefined,
          1: undefined,
          2: undefined,
          3: { suit: DIAMONDS, bid: 80, bidBy: 3 }
        }
      };
      const result = PlaceBid(G, { currentPlayer: 0 }, { suit: SANS, bid: 80 });
      expect(result).toEqual(undefined);
      expect(G.bids[0]).toEqual({ suit: SANS, bid: 80, bidBy: 0 });
    });

    it('does not allow bidding 80 SANS on 90 DIAMONDS', () => {
      const G = {
        ..._.cloneDeep(initialGame),
        dealer: 2,
        bids: {
          0: undefined,
          1: undefined,
          2: undefined,
          3: { suit: DIAMONDS, bid: 90, bidBy: 3 }
        }
      };
      const result = PlaceBid(G, { currentPlayer: 0 }, { suit: SANS, bid: 80 });
      expect(result).toEqual(INVALID_MOVE);
      expect(G.bids[0]).toEqual(undefined);
      expect(G.bids[3]).toEqual({ suit: DIAMONDS, bid: 90, bidBy: 3 });
    });

    it('does not allow bidding 80 SANS on 80 SANS', () => {
      const G = {
        ..._.cloneDeep(initialGame),
        dealer: 2,
        bids: {
          0: undefined,
          1: undefined,
          2: undefined,
          3: { suit: SANS, bid: 80, bidBy: 3 }
        }
      };
      const result = PlaceBid(G, { currentPlayer: 0 }, { suit: SANS, bid: 80 });
      expect(result).toEqual(INVALID_MOVE);
      expect(G.bids[0]).toEqual(undefined);
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
