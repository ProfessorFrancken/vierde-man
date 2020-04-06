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

  // Rotate based on position on table and add small rotation so that the middle
  // cards are better centered
  transform: rotate(
    calc(90deg * var(--position-on-table) + 0.5 * var(--rotation))
  );

  ${({ active }) =>
    active &&
    css`
      div:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        box-shadow: var(--active-shadow);
      }
    `}
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
  <Hand
    className="list-unstyled mb-0"
    positionOnTable={positionOnTable}
    active={active}
  >
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
