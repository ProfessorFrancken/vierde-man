import React from 'react';
import styled from 'styled-components';
import Player from 'App/Player';
import { GameProvider } from 'game/context';
import francken from 'assets/francken.png';
import tableBackground from 'assets/table-background.jpg';

const SinglePlayer = styled.div`
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: 'player-0 player-1 player-2 player-3';

  background: no-repeat center center url('${francken}'),
    url('${tableBackground}');
  background-blend-mode: overlay;
`;

const KlaverJasBoard = (props) => {
  const urlParams = new URLSearchParams(window.location.search);
  const { G, moves, ctx } = props;
  const { phase } = ctx;
  const playerID =
    props.playerID === null ? null : parseInt(props.playerID, 10) || 0;

  return (
    <GameProvider
      game={G}
      ctx={ctx}
      moves={moves}
      playerID={playerID}
      gameMetadata={props.gameMetadata}
    >
      <div className="App overflow-hidden">
        <SinglePlayer>
          <Player
            id={playerID === null ? parseInt(ctx.currentPlayer, 10) : playerID}
            game={G}
            moves={moves}
            phase={phase}
            currentPlayer={parseInt(ctx.currentPlayer, 10)}
            practice={urlParams.has('practice')}
          />
        </SinglePlayer>
      </div>
    </GameProvider>
  );
};

export default KlaverJasBoard;
