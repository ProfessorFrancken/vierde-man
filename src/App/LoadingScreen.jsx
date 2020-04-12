import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingScreen = (props) => (
  <div
    className="d-flex align-items-center justify-content-center flex-column"
    style={{
      height: '100vh',
      width: '100vw',
      maxHeight: '100vh',
      maxWidth: '100vw',
      textShadow: '0 1px 0 rgba(255, 255, 255, 0.4)',
    }}
  >
    <FontAwesomeIcon
      icon={faSpinner}
      className="text-white my-4"
      spin
      size="5x"
    />
    <h1 className="text-white mt-5">Cleaning the klaverjas table...</h1>
  </div>
);

export default LoadingScreen;
