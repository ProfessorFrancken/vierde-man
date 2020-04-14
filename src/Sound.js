import soundsMiddleware from 'redux-sounds';
import playCardSfx from 'assets/sounds/card_play.mp3';
import placeBidSfx from 'assets/sounds/place_bid.mp3';

const soundsData = {
  playCard: playCardSfx,
  placeBid: placeBidSfx,
};

export const playSoundsMiddleware = (store) => (next) => (action) => {
  // For each move we define a sound that should be played after this move
  const payloadTypeToSound = {
    PlayCard: { play: 'playCard' },
    PlaceBid: { play: 'placeBid' },
    Pass: { play: 'placeBid' },
  };

  // We want to (possibly) play a sound after every game upate, where the
  // deltalog contains the moves made in a game update
  const sounds =
    action.type !== 'UPDATE'
      ? []
      : action.deltalog
          .filter(({ action }) => action.payload.type in payloadTypeToSound)
          .map(({ action }) => payloadTypeToSound[action.payload.type]);

  // I haven't yet figured out how to play more than 1 sound at a time using,
  // the meta keys, so we will pick the first sound that should be played
  const sound = sounds.pop();

  return next({ ...action, meta: { ...action.meta, sound } });
};

// Pre-load our middleware with our sounds data.
export const loadedSoundsMiddleware = soundsMiddleware(soundsData);
