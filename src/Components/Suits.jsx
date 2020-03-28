import React from 'react';
import { Spades, Hearts, Diamonds, Clubs, Sans } from 'Components/SuitIcon';

export const SuitStringToComponent = ({ suit }) => {
  switch (suit) {
    case 'spades':
    case 'S':
      return <Spades />;
    case 'hearts':
    case 'H':
      return <Hearts />;
    case 'diamonds':
    case 'D':
      return <Diamonds />;
    case 'clubs':
    case 'C':
      return <Clubs />;
    case 'sans':
    case 'SANS':
      return <Sans />;
    default:
      return `${suit} is not a valid suit choice`;
    // default:
    //   throw Error(`${suit} is not a valid suit choice`);
  }
};

export const Bid = props => (
  <span>
    <strong className="mr-2">{props.bid}</strong>
    <SuitStringToComponent suit={props.suit} />
  </span>
);

export { Spades, Hearts, Diamonds, Clubs, Sans };
