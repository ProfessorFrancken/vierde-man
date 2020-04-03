import soundsMiddleware from 'redux-sounds';
import playCardSfx from 'assets/sounds/card_play.mp3';

const soundsData = {
  playCard: playCardSfx
};

export const playSoundsMiddleware = store => next => action => {
  // NOTE: we only check if a PlayCard move is made, we don't yet check if it
  // is / was a valid move
  if (action.type === 'MAKE_MOVE' && action.payload.type === 'PlayCard') {
    return next({
      ...action,
      meta: { ...action.meta, sound: { play: 'playCard' } }
    });
  }

  return next(action);
};

// Pre-load our middleware with our sounds data.
export const loadedSoundsMiddleware = soundsMiddleware(soundsData);
