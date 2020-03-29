import React from 'react';
import sans from 'assets/Sans2.png';
import styled from 'styled-components';

const SuitIcon = props => {
  const imgStyle = {
    width: props.width ? props.width : '20px'
  };

  return <img src={props.src} style={imgStyle} alt={props.alt} />;
};

const red = '#e44145';
const black = '#252525';

const RedSuit = styled.span`
  color: ${red};
`;
const BlackSuit = styled.span`
  color: ${black};
`;

export const Spades = () => <BlackSuit>♠</BlackSuit>;
export const Hearts = () => <RedSuit>♥</RedSuit>;
export const Diamonds = () => <RedSuit>♦</RedSuit>;
export const Clubs = () => <BlackSuit>♣</BlackSuit>;
export const Sans = () => <SuitIcon src={sans} width="60px" alt="Sans" />;
