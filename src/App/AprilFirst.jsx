import React from 'react';
import Card from 'Components/Card';
import { SUITES } from 'GameLogic/Card';

const AprilFirst = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ width: '100vw', height: '100vh' }}
    >
      <div className="d-flex my-4">
        <Card card={{ face: 'H', suit: SUITES.HEARTS }} />
        <Card card={{ face: 'O', suit: SUITES.HEARTS }} />
        <Card card={{ face: 'I', suit: SUITES.HEARTS }} />
      </div>
      <div className="d-flex my-4">
        <Card card={{ face: '1', suit: 'APRIL' }} />
        <Card card={{ face: 'A', suit: 'APRIL' }} />
        <Card card={{ face: 'P', suit: 'APRIL' }} />
        <Card card={{ face: 'R', suit: 'APRIL' }} />
        <Card card={{ face: 'I', suit: 'APRIL' }} />
        <Card card={{ face: 'L', suit: 'APRIL' }} />
      </div>
    </div>
  );
};

export default AprilFirst;
