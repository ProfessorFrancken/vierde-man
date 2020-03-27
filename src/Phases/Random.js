import { Random } from './random/random';

export default {
  name: 'randomness',

  noClient: ({ api }) => {
    return api._obj.isUsed();
  },

  flush: ({ api }) => {
    return api._obj.getState();
  },

  api: ({ data }) => {
    const random = new Random(data);
    return random.api();
  },

  setup: ({ game }) => {
    let seed = game.seed;
    if (seed === undefined) {
      seed = Random.seed();
    }
    return { seed };
  }
};
