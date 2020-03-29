import React from 'react';
import sans from 'assets/Sans2.png';

const SuitIcon = props => {
  const imgStyle = {
    width: props.width ? props.width : '20px'
  };

  return <img src={props.src} style={imgStyle} alt={props.alt} />;
};

export const Spades = () => <span className="text-dark">♠</span>;
export const Hearts = () => <span className="text-danger">♥</span>;
export const Diamonds = () => <span className="text-danger">♦</span>;
export const Clubs = () => <span className="text-dark">♣</span>;
export const Sans = () => <SuitIcon src={sans} width="60px" alt="Sans" />;
