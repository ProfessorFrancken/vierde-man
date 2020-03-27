import React from 'react';

// https://github.com/Adom/npm-react-casino/blob/master/src/components.js
export const CardComponent = ({
  suit,
  face,
  className,
  style,
  onClick = () => {},
  onHover = () => {}
}) => {
  const defaultClasses = ['playing-card'];
  suit = String(suit).toUpperCase();
  face = String(face).toUpperCase();
  switch (suit) {
    case 'C':
    case 'D':
    case 'H':
    case 'S':
      break;
    default:
      suit = '';
  }
  switch (suit.length && face) {
    case 'A':
    case 'K':
    case 'Q':
    case 'J':
    case 'T':
    case '9':
    case '8':
    case '7':
    case '6':
    case '5':
    case '4':
    case '3':
    case '2':
      break;
    default:
      face = 'BACK';
  }
  const click = (e, card) => {
    onClick(e, card);
  };
  const hover = (e, card) => {
    onHover(e, card);
  };
  const reducedClassNames = (a, b) => a;
  return (
    <span
      onClick={e => click(e, { face, suit })}
      onMouseOver={e => hover(e, { face, suit })}
      className={reducedClassNames(defaultClasses, className)}
    >
      <img
        src={require(`./assets/png/cards/${face}${suit}.png`)}
        alt={`${face}${suit}`}
        style={{ width: 150, height: 217, ...style }}
      />
    </span>
  );
};
export default CardComponent;
