import React, { useState } from 'react';
import Card from 'Components/Card';
import _ from 'lodash';
import styled from 'styled-components';

const CardStack = styled.ul`
  z-index: var(--card-stack-z-index);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  transform: rotate(${({ rotate }) => rotate}deg);

  li {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    transform-origin: center center;
    z-index: var(--card-stack-card-z-index);

    &:nth-child(1) {
      transform: translate(-50%, -30%)
        rotate(
          ${({ randomPlacements }) => (randomPlacements[0] - 1) * 10 + 0}deg
        );
    }

    &:nth-child(2) {
      transform: translate(-80%, -50%)
        rotate(
          ${({ randomPlacements }) => (randomPlacements[1] - 1) * 20 + 90}deg
        );
    }

    &:nth-child(3) {
      transform: translate(-50%, -70%)
        rotate(
          ${({ randomPlacements }) => (randomPlacements[2] - 1) * 20 + 180}deg
        );
    }

    &:nth-child(4) {
      transform: translate(-20%, -50%)
        rotate(
          ${({ randomPlacements }) => (randomPlacements[3] - 1) * 20 + 270}deg
        );
    }

    :hover {
      z-index: var(--card-stack-hover-card-z-index);
    }
  }
`;

const PlayedCards = ({ cards, startingPlayer, playerId }) => {
  const [randomPlacements] = useState([
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random()
  ]);

  // The cards given are not in the order in which they were played,
  // so we will have to manually order them based on the starting player
  const playedCards = _.concat(
    ..._(cards)
      .reject(card => card === undefined)
      .partition(({ playedBy }) => playedBy < startingPlayer)
      .reverse()
      .values()
  );

  const rotate = (startingPlayer - playerId) * 90;

  return (
    <CardStack
      className="list-unstyled d-flex justify-content-between"
      rotate={rotate}
      randomPlacements={randomPlacements}
    >
      {_.map(playedCards, (card, idx) => {
        return <Card key={card.playedBy} card={card} onClick={() => {}} />;
      })}
    </CardStack>
  );
};

export default PlayedCards;
