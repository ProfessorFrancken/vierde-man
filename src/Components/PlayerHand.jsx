import React from 'react';
import { playerIsAllowedToPlayCard } from 'GameLogic/Phases/PlayTricks';
import Card from 'Components/Card';
import styled, { css } from 'styled-components';

const CardContainer = styled.div`
  --fromMiddle: ${({ fromMiddle }) => fromMiddle};
  --fromMiddleAbs: ${({ fromMiddle }) => Math.abs(fromMiddle)};

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(
      calc(var(--x-scale) * var(--fromMiddle) - var(--x-offset)),
      calc(var(--y-scale) * var(--fromMiddleAbs) - var(--y-offset))
    )
    rotate(calc(var(--fromMiddle) * var(--rotation)));
  transform-origin: bottom right;
  z-index: var(--hand-card-z-index);

  ${({ disabled }) =>
    !disabled &&
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

  --position-on-table: ${({ positionOnTable }) => positionOnTable};
  --rotation: ${({ positionOnTable }) =>
    [1, 3].includes(positionOnTable) ? 3 : 5}deg;

  --x-offset: 50%;
  --y-offset: 30%;
  --x-scale: 25%;
  --y-scale: 5%;

  // Rotate slightely so that the middle cards are better centered
  transform: rotate(calc(0.5 * var(--rotation)));
  --cardScale: 1;

  // Small devices (landscape phones, 576px and up)
  @media (min-width: 576px) {
    --cardScale: 1.3;
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) {
    --cardScale: 1.5;
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
    --cardScale: 1.8;
  }

  // Extra large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) {
    --cardScale: 2;
  }
`;

const PlayerHand = ({
  game,
  hand,
  playerId,
  visible,
  moves,
  positionOnTable,
  active = false
}) => (
  <Hand className="list-unstyled mb-0" positionOnTable={positionOnTable}>
    {hand.map((card, idx) => {
      const disabled =
        !active || !visible || !playerIsAllowedToPlayCard(game, playerId, card);

      const fanRotation = 5;
      return (
        <CardContainer
          className="card-container"
          rotate={(idx - (hand.length - 1) / 2) * fanRotation}
          fromMiddle={idx - (hand.length - 1) / 2}
          disabled={disabled}
          key={idx}
        >
          <Card
            key={idx}
            game={game}
            card={card}
            visible={visible}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
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
