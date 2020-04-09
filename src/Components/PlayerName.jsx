import React from 'react';
import { useGame } from 'game/context';

const PlayerName = ({ playerId }) => {
  const { gameMetadata = [] } = useGame();
  const { name } = gameMetadata.find(({ id }) => id === playerId) || {
    name: `Player ${playerId}`
  };
  return <span>{name}</span>;
};

export default PlayerName;
