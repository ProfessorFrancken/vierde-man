import React from 'react';
import { GameContext } from 'KlaverJasBoard';

const PlayerName = ({ playerId }) => (
  <GameContext.Consumer>
    {({ gameMetadata = [] }) => {
      const player = gameMetadata.find(({ id }) => id === playerId);
      return player ? (
        <span>{player.name}</span>
      ) : (
        <span>Player {playerId}</span>
      );
    }}
  </GameContext.Consumer>
);

export default PlayerName;
