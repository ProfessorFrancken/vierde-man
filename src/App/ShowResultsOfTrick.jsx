import React from 'react';
import { SuitStringToComponent } from 'Components/Suits';
import { WinnerOfTrick, PointsOfTrick } from 'GameLogic/Card';
import Modal from 'Components/Modal';
import PlayerName from 'Components/PlayerName';
import { useSpring, animated } from 'react-spring';
import { WaitingForPlayers } from 'Components/WaitingForPlayers';
import styled from 'styled-components';

const SmallText = styled.div`
  font-size: 0.8em;
  margin-top: 1em;
`;

const Prominent = ({ children }) => (
  <span>{children === 33 ? "'Vo" : children}</span>
);

export const Bid = ({ bid }) => {
  if (bid.bid === null) {
    return <span>Pass</span>;
  }

  return (
    <span className="">
      <strong className="mr-2">{bid.bid}</strong>
      <SuitStringToComponent suit={bid.suit} />
    </span>
  );
};

const ShowResultsOfTrick = ({
  moves,
  continueNextTrick,
  currentTrick: { playedCards, startingPlayer },
  trump,
  playerId,
  currentPlayer,
  continueTrickAutomatically = {},
  playersThatWantToContinue = [],
}) => {
  const springProps = useSpring({
    width: '100%',
    from: { width: '0%' },
    delay: 500,
    config: { duration: 1000 },
    onRest: () => {
      if (!playersThatWantToContinue.includes(playerId)) {
        moves.ContinueToNextTrick(playerId, true);
      }
    },
  });
  const winner = WinnerOfTrick(playedCards, playedCards[startingPlayer], trump);
  const points = PointsOfTrick(playedCards, trump);

  return (
    <div
      style={{
        zIndex: 'var(--modal-z-index)',
        position: 'absolute',
        top: '0',
      }}
    >
      <Modal.Dialog>
        <Modal.Header className="border-bottom-0">
          <Modal.Title>
            <PlayerName playerId={winner} /> won the trick
          </Modal.Title>
          <ul className="list-unstyled mb-0 d-flex justify-content-between text-muted">
            <li>
              <strong>Points </strong>: <Prominent>{points.points}</Prominent>
            </li>
            {points.honor > 0 && (
              <li>
                <strong>Honor </strong>: <Prominent>{points.honor}</Prominent>
              </li>
            )}
          </ul>
          {playersThatWantToContinue.includes(playerId) && (
            <SmallText>
              <WaitingForPlayers
                playersThatWantToContinue={playersThatWantToContinue}
              />
            </SmallText>
          )}
        </Modal.Header>
        <div
          className="progress"
          style={{ borderRadius: '0', height: '0.5rem' }}
        >
          <animated.div
            className="bg-primary"
            role="progressbar"
            style={springProps}
          ></animated.div>
        </div>
      </Modal.Dialog>
    </div>
  );
};

export default ShowResultsOfTrick;
