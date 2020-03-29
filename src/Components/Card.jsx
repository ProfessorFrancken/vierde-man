import React from 'react';
import { SuitStringToComponent } from 'Components/Suits';

const Card = props => {
  const { disabled, card, onClick } = props;
  const { face, suit } = card;

  let className =
    'p-4 px-3 shadow-sm rounded font-weight-bold d-flex align-items-center justify-content-between flex-column text-center';
  if (!disabled) {
    className += ' bg-light text-muted font-weight-light';
  } else {
    className += ' border border-primary';
  }

  return (
    <li className={className} onClick={onClick}>
      <SuitStringToComponent suit={suit} />
      <span className="mt-5 ">{face}</span>
    </li>
  );
};

export default Card;
