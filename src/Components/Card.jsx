import React, { useState } from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import styled from 'styled-components';

// TODO: if player name is Sven or sbte, then shake cards

const cardRatio = 1.5;
const CardLi = styled.li`
  transition: all 0.3s ease-out;
  transform: rotate(${props => props.rotate}deg);

  width: ${() => 58 * cardRatio}px;
  height: ${() => 88 * cardRatio}px;

  :hover {
    transform: scale(1) rotate(${props => props.rotate}deg);
    cursor: pointer;
    background: white !important;
  }
`;

const Card = props => {
  const { disabled = false, card, onClick } = props;
  const { face, suit } = card;

  // Rotate each card a little bit to make the cards feel less static
  const baseRotate = 3;
  const [rotate] = useState(Math.floor(baseRotate * (Math.random() * 2 - 1)));

  let className =
    'border p-4 px-4 shadow-sm rounded font-weight-bold d-flex align-items-center justify-content-between flex-column text-center';
  if (!disabled) {
    className += ' bg-light text-muted font-weight-light';
  } else {
    className += ' border border-primary';
  }

  return (
    <CardLi className={className} onClick={onClick} rotate={rotate}>
      <SuitStringToComponent suit={suit} />
      <span>{face}</span>
    </CardLi>
  );
};

export default Card;
