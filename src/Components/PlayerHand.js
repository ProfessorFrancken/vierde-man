import React from 'react';
import { playerIsAllowedToPlayCard } from 'GameLogic/Phases/PlayTricks';
import Card from 'Components/Card';
import styled from 'styled-components';

const CardContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%) rotate(${props => props.rotate}deg);
  transform-origin: bottom center;
  z-index: 0;

  :hover {
    z-index: 10;
  }
`;

const Hand = styled.ul`
  z-index: 0;
  // display: grid;
  width: 100%;
  // grid-template-columns: repeat(8, 1fr);
  // grid-template-rows: repeat(1, 1fr);
  li {
    background: white;
    // margin: 0rem 0.25rem;
  }
  display: flex;
  justify-content: center;
  // width: 500px;
  position: relative;

  // .card-container {
  //   flex: 1 0 0;
  //   // overflow-x: hidden;
  // }
  // .card-container:last-child {
  //   flex: 0 0 auto;
  // }
`;

const PlayerHand = ({ game, hand, playerId, moves }) => (
  <Hand className="list-unstyled mb-0">
    {hand.map((card, idx) => (
      <CardContainer className="card-container" rotate={(idx - 3.5) * 20}>
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
    ))}
  </Hand>
);

export default PlayerHand;
