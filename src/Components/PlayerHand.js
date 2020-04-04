import React from 'react';
import { playerIsAllowedToPlayCard } from 'GameLogic/Phases/PlayTricks';
import Card from 'Components/Card';
import styled, { css } from 'styled-components';

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
  z-index: var(--hand-card-z-index);

  ${props =>
    !props.disabled &&
    css`
      :hover {
        z-index: var(--hand-card-hover-z-index);
      }
    `}
`;

const Hand = styled.ul`
  z-index: var(--hand-z-index);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
`;

const PlayerHand = ({
  game,
  hand,
  playerId,
  visible,
  moves,
  active = false
}) => (
  <Hand className="list-unstyled mb-0">
    {hand.map((card, idx) => {
      const fanRotation = 20;
      return (
        <CardContainer
          className="card-container"
          rotate={((idx - (hand.length - 1) / 2) * fanRotation) / 4}
          up={(idx - (hand.length - 1) / 2) * fanRotation}
          disabled={
            !active ||
            !playerIsAllowedToPlayCard(game, playerId, card) ||
            !visible
          }
          key={idx}
        >
          <Card
            key={idx}
            game={game}
            card={card}
            visible={visible}
            disabled={
              !active ||
              !playerIsAllowedToPlayCard(game, playerId, card) ||
              !visible
            }
            onClick={() => {
              if (active && playerIsAllowedToPlayCard(game, playerId, card)) {
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
