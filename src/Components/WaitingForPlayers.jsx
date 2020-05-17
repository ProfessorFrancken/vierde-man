import React from 'react';
import PlayerName from 'Components/PlayerName';

export const WaitingForPlayers = ({ playersThatWantToContinue = [] }) => {
  const playerIds = [0, 1, 2, 3].filter(
    (playerId) => !playersThatWantToContinue.includes(playerId)
  );

  if (playerIds.length === 1) {
    return (
      <div className=" text-muted">
        Waiting for:{' '}
        <span>
          <PlayerName playerId={playerIds[0]} />
        </span>
      </div>
    );
  }

  if (playerIds.length === 2) {
    return (
      <div className=" text-muted">
        Waiting for:{' '}
        <span>
          <PlayerName playerId={playerIds[0]} /> and{' '}
          <PlayerName playerId={playerIds[1]} />
        </span>
      </div>
    );
  }

  if (playerIds.length === 3) {
    return (
      <div className=" text-muted">
        Waiting for:{' '}
        <span>
          <PlayerName playerId={playerIds[0]} />,{' '}
          <PlayerName playerId={playerIds[1]} /> and{' '}
          <PlayerName playerId={playerIds[2]} />
        </span>
      </div>
    );
  }
  return (
    <div className=" text-muted">Something went wrong, please refresh</div>
  );
};
