import React, { useEffect } from 'react';
import { playerIsAllowedToPlayCard } from 'GameLogic/Phases/PlayTricks';
import Card from 'Components/Card';
import styled, { css } from 'styled-components';
import { rankOfCard } from 'GameLogic/Card';
import _ from 'lodash';

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
`;

const usePlayLastCard = (moves, cantPlay, hand, game, playerId) => {
  useEffect(() => {
    if (hand.length === 1) {
      const card = hand[0];
      const disabled =
        cantPlay || !playerIsAllowedToPlayCard(game, playerId, card);

      if (!disabled) {
        const timer = setTimeout(() => {
          moves.PlayCard(card);
        }, 300);

        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [moves, cantPlay, hand, game, playerId]);
};

const sortHandByRank = (hand) => {
  const suitOrder = {
    C: 1,
    H: 2,
    S: 3,
    D: 4,
  };
  return _.sortBy(hand, ({ suit, face }) => [
    suitOrder[suit],
    rankOfCard({ face }, false),
  ]);
};

// If player is active, and has only 1 card left, play card
const PlayerHand = ({
  game,
  hand,
  playerId,
  visible,
  moves,
  positionOnTable,
  active = false,
}) => {
  const cantPlay = !active || !visible;
  usePlayLastCard(moves, cantPlay, hand, game, playerId);

  const cards = sortHandByRank(hand);

  return (
    <Hand
      className="list-unstyled mb-0"
      positionOnTable={positionOnTable}
      active={active}
    >
      {cards.map((card, idx) => {
        const disabled =
          cantPlay || !playerIsAllowedToPlayCard(game, playerId, card);

        const fanRotation = 5;
        return (
          <CardContainer
            className="card-container"
            rotate={(idx - (hand.length - 1) / 2) * fanRotation}
            fromMiddle={idx - (hand.length - 1) / 2}
            disabled={disabled}
            key={`card-${card.suit}-${card.face}`}
          >
            <Card
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
};

export default PlayerHand;
