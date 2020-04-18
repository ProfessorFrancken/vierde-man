import React from 'react';

const GameContext = React.createContext();
GameContext.displayName = 'GameContext';

function GameProvider(props) {
  const playerID =
    props.playerID === null ? null : parseInt(props.playerID, 10) || 0;

  return (
    <GameContext.Provider
      value={{
        game: props.game,
        ctx: props.ctx,
        moves: props.moves,
        playerID: playerID,
        gameMetadata: props.gameMetadata,
      }}
      {...props}
    />
  );
}

function useGame() {
  const context = React.useContext(GameContext);
  if (context === undefined) {
    throw new Error(`useGame must be used within a GameProvider`);
  }
  return context;
}
export { GameProvider, useGame };
