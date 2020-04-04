import React from 'react';
import sans from 'assets/Sans2.png';
import styled from 'styled-components';

const SuitIcon = props => {
  const imgStyle = {
    width: props.width ? props.width : '20px'
  };

  return <img src={props.src} style={imgStyle} alt={props.alt} />;
};

const RedSuit = styled.span`
  color: var(--red-suit-color);
`;
const BlackSuit = styled.span`
  color: var(--black-suit-color);
`;

export const Spades = () => <BlackSuit>♠</BlackSuit>;
export const Hearts = () => <RedSuit>♥</RedSuit>;
export const Diamonds = () => <RedSuit>♦</RedSuit>;
export const Clubs = () => <BlackSuit>♣</BlackSuit>;
export const Sans = () => <SuitIcon src={sans} width="60px" alt="Sans" />;

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
    case 'APRIL':
      return (
        <span style={{ color: '#8f8500' }} role="img" aria-label="April Fools">
          🐸
        </span>
      );
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
