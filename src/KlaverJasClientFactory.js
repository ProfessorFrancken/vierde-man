import { Client } from 'boardgame.io/react';
import { KlaverJassen } from 'GameLogic/Game';
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';
import { loadedSoundsMiddleware, playSoundsMiddleware } from 'Sound';
import KlaverJasBoard from 'KlaverJasBoard';
import LoadingScreen from 'App/LoadingScreen';

const KlaverJasClientFactory = ({
  game = KlaverJassen,
  board = KlaverJasBoard,
  debug = false,
  multiplayer = undefined,
}) =>
  Client({
    game,
    debug,
    board,
    numPlayers: 4,
    multiplayer,
    loading: LoadingScreen,
    enhancer: applyMiddleware(
      logger,
      playSoundsMiddleware,
      loadedSoundsMiddleware
    ),
  });

export default KlaverJasClientFactory;
