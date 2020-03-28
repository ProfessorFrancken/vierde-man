import React from 'react';
import spades from 'assets/Spade.png';
import hearts from 'assets/Heart.png';
import diamonds from 'assets/Diamond.png';
import clubs from 'assets/Club.png';
import sans from 'assets/Sans2.png';

const SuitIcon = props => {
  const imgStyle = {
    width: props.width ? props.width : '20px'
  };

  return <img src={props.src} style={imgStyle} alt={props.alt} />;
};

export const Spades = () => <SuitIcon src={spades} alt="Suit of spades" />;
export const Hearts = () => <SuitIcon src={hearts} alt="Suit of hearts" />;
export const Diamonds = () => (
  <SuitIcon src={diamonds} alt="Suit of diamonds" />
);
export const Clubs = () => <SuitIcon src={clubs} alt="Suit of clubs" />;
export const Sans = () => <SuitIcon src={sans} width="60px" alt="Sans" />;
