import React from 'react';
import { playerIsAllowedToPlayCard } from 'GameLogic/Phases/PlayTricks';
import Card from 'Components/Card';
import styled from 'styled-components';

const CardContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(
      ${({ rotate }) => -(50 - (5 * rotate) / 1)}%,
      ${({ rotate }) => -(30 - 1.0 * Math.abs(rotate))}%
    )
    rotate(${({ rotate }) => rotate}deg);
  transform-origin: bottom right;
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
`;

const PlayerHand = ({ game, hand, playerId, visible, moves }) => (
  <Hand className="list-unstyled mb-0">
    {hand.map((card, idx) => {
      const fanRotation = 20;
      return (
        <CardContainer
          className="card-container"
          rotate={((idx - (hand.length - 1) / 2) * fanRotation) / 4}
          up={(idx - (hand.length - 1) / 2) * fanRotation}
          key={idx}
        >
          <Card
            key={idx}
            game={game}
            card={card}
            visible={visible}
            disabled={
              !playerIsAllowedToPlayCard(game, playerId, card) || !visible
            }
            onClick={() => {
              if (playerIsAllowedToPlayCard(game, playerId, card)) {
                moves.PlayCard(card);
              }
            }}
          />
        </CardContainer>
      );
    })}
  </Hand>
);

export default PlayerHand;
