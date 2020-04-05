import React from 'react';
import styled from 'styled-components';
import Player from 'App/Player';

const SinglePlayer = styled.div`
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: 'player-0 player-1 player-2 player-3';
`;

export const GameContext = React.createContext();
GameContext.displayName = 'GameContext';

const KlaverJasBoard = props => {
  const urlParams = new URLSearchParams(window.location.search);
  const { G, moves, ctx } = props;
  const { phase } = ctx;
  const playerID =
    props.playerID === null ? null : parseInt(props.playerID, 10) || 0;

  return (
    <GameContext.Provider game={G} ctx={ctx} moves={moves} playerID={playerID}>
      <div className="App overflow-hidden">
        <SinglePlayer>
          <Player
            id={playerID}
            game={G}
            moves={moves}
            phase={phase}
            currentPlayer={parseInt(ctx.currentPlayer, 10)}
            practice={urlParams.has('practice')}
          />
        </SinglePlayer>
      </div>
    </GameContext.Provider>
  );
};

export default KlaverJasBoard;
