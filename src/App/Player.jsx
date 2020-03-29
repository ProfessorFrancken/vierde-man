import React from 'react';
import PlaceBid from 'App/PlaceBid';
import { playerIsAllowedToPlayCard } from 'GameLogic/Phases/PlayTricks';
import styled from 'styled-components';
import Header from 'App/Header';
import Card from 'Components/Card';

const PlayerContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
  border: thin solid #dddddd;
  grid-area: ${props => 'player-' + props.id};
  background-color: ${props =>
    props.id === 1 || props.id === 3 ? '#fafafa' : '#fafefa'};
`;

const PlayerHand = styled.ul`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(1, 1fr);
  li {
    background: white;
    margin: 0rem 0.25rem;
  }
`;

const Player = ({
  id,
  name,
  cards = [],
  selectedSuit = id === 1 ? 'sans' : 'hearts',
  selectedBid = 90,
  moves,
  game,
  phase,
  currentPlayer
}) => {
  const playerHand = game.hands[id];
  const playerIsActive = currentPlayer === id;

  return (
    <PlayerContainer id={id}>
      <Header
        game={game}
        phase={phase}
        currentBids={game.bids}
        currentPlayer={currentPlayer}
      />
      <div className="p-3 flex-grow-1 d-flex flex-column justify-content-between">
        <header className="d-flex justify-content-between w-100">
          <h1 className="h5">{name}</h1>
          <small>
            {playerIsActive
              ? phase
              : `Waiting for ${currentPlayer} to make its turn...`}
          </small>
        </header>

        <div>
          <PlayerHand className="list-unstyled mb-0">
            {playerHand.map((card, idx) => (
              <Card
                key={idx}
                game={game}
                card={card}
                disabled={playerIsAllowedToPlayCard(game, id, card)}
                onCLick={() => moves.PlayCard(card)}
              />
            ))}
          </PlayerHand>
        </div>

        {playerIsActive && phase === 'PlaceBids' && (
          <PlaceBid
            placeBid={moves.PlaceBid}
            pass={moves.Pass}
            currentBids={game.bids}
            currentPlayer={currentPlayer}
          />
        )}
      </div>
    </PlayerContainer>
  );
};

export default Player;
