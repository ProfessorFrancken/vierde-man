import PropTypes from 'prop-types';
import styled from 'styled-components';

const KlaverJasBoard = props => {
  const ScoreBoard = () => (
    <>
      <h3>Scoreboard</h3>
      <p>Wij: 100, zij: 0.</p>
      <h4>Boom</h4>
      <h5>Tak</h5>
      <h5>Tak</h5>
      <h5>Tak</h5>
      <h5>Tak</h5>
    </>
  );
  const BiddingBoard = () => (
    <>
      <h3>Bidding board</h3>
    </>
  );
  const PlayHandBoard = () => (
    <>
      <h3>Play hand board</h3>
    </>
  );

  const isBidding = true;
  const isPlayingHand = false;

  return (
    <>
      <h2>HOI</h2>
      <ScoreBoard />
      {isBidding && <BiddingBoard />}
      {isPlayingHand && <PlayHandBoard />}
    </>
  );
};

KlaverJasBoard.propTypes = {
  G: PropTypes.any.isRequired,
  ctx: PropTypes.any.isRequired,
  moves: PropTypes.any.isRequired,
  playerID: PropTypes.string,
  isActive: PropTypes.bool,
  isMultiplayer: PropTypes.bool,
  isConnected: PropTypes.bool,
  isPreview: PropTypes.bool
};

export default KlaverJasBoard;
