import React from 'react';
import { playerIsAllowedToPlayCard } from 'GameLogic/Phases/PlayTricks';
import Card from 'Components/Card';
import styled from 'styled-components';

const CardContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(${props => props.rotate}deg);
  transform-origin: bottom center;
  z-index: 0;

  :hover {
    z-index: 10;
  }
`;

const Hand = styled.ul`
  z-index: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;

  li {
    background: white;
  }
`;

const PlayerHand = ({ game, hand, playerId, moves }) => (
  <Hand className="list-unstyled mb-0">
    {hand.map((card, idx) => {
      const fanRotation = 20;
      return (
        <CardContainer
          className="card-container"
          rotate={(idx - (hand.length - 1) / 2) * fanRotation}
        >
          <Card
            key={idx}
            game={game}
            card={card}
            disabled={playerIsAllowedToPlayCard(game, playerId, card)}
            onClick={() => {
              moves.PlayCard(card);
            }}
          />
        </CardContainer>
      );
    })}
  </Hand>
);

export default PlayerHand;
