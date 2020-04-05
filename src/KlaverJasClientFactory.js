import { Client } from 'boardgame.io/react';
import { KlaverJassen } from 'GameLogic/Game';
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';
import { loadedSoundsMiddleware, playSoundsMiddleware } from 'Sound';
import KlaverJasBoard from 'KlaverJasBoard';

const KlaverJasClientFactory = ({
  game = KlaverJassen,
  board = KlaverJasBoard,
  debug = true,
  multiplayer = undefined
}) =>
  Client({
    game,
    debug,
    board,
    numPlayers: 4,
    multiplayer,
    loading: props => {
      return 'Loading component';
    },
    enhancer: applyMiddleware(
      logger,
      playSoundsMiddleware,
      loadedSoundsMiddleware
    )
  });

export default KlaverJasClientFactory;
