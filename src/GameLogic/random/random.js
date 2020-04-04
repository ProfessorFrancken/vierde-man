/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import { alea } from './random.alea';

/**
 * Random
 *
 * Calls that require a pseudorandom number generator.
 * Uses a seed from ctx, and also persists the PRNG
 * state in ctx so that moves can stay pure.
 */
export class Random {
  /**
   * constructor
   * @param {object} ctx - The ctx object to initialize from.
   */
  constructor(state) {
    // If we are on the client, the seed is not present.
    // Just use a temporary seed to execute the move without
    // crashing it. The move state itself is discarded,
    // so the actual value doesn't matter.
    this.state = state;
    this.used = false;
  }

  isUsed() {
    return this.used;
  }

  getState() {
    return this.state;
  }

  /**
   * Generate a random number.
   */
  _random() {
    this.used = true;

    const R = this.state;

    let fn;
    if (R.prngstate === undefined) {
      // No call to a random function has been made.
      fn = new alea(R.seed, { state: true });
    } else {
      fn = new alea('', { state: R.prngstate });
    }

    const number = fn();

    this.state = {
      ...R,
      prngstate: fn.state()
    };

    return number;
  }

  api() {
    const random = this._random.bind(this);
    return {
      /**
       * Shuffle an array.
       *
       * @param {Array} deck - The array to shuffle. Does not mutate
       *                       the input, but returns the shuffled array.
       */
      Shuffle: deck => {
        let clone = deck.slice(0);
        let srcIndex = deck.length;
        let dstIndex = 0;
        let shuffled = new Array(srcIndex);

        while (srcIndex) {
          let randIndex = (srcIndex * random()) | 0;
          shuffled[dstIndex++] = clone[randIndex];
          clone[randIndex] = clone[--srcIndex];
        }

        return shuffled;
      },

      _obj: this
    };
  }
}

/**
 * Generates a new seed from the current date / time.
 */
Random.seed = function() {
  return (+new Date()).toString(36).slice(-10);
};
