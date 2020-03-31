import React, { useState } from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import styled from 'styled-components';

// TODO: if player name is Sven or sbte, then shake cards

const CardLi = styled.li`
  width: 80px;
  transform: rotate(0deg);
  overflow: hidden;
  transition: all 0.3s ease-out;
  transform: rotate(${props => props.rotate}deg);

  margin-right: -${props => props.rotate}px;
  margin-left: ${props => props.rotate}px;

  :hover {
    transform: scale(1.3) rotate(${props => props.rotate}deg);
    cursor: pointer;
    background: white !important;
  }
`;

const Card = props => {
  const { disabled, card, onClick } = props;
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
      <span className="mt-5 ">{face}</span>
    </CardLi>
  );
};

export default Card;
