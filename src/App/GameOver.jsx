import React, { useState } from 'react';

const GameOver = () => {
  const [showHoi, setShowHoi] = useState(false);

  console.log(showHoi);

  return (
    <div className=" bg-white shadow rounded">
      <div className="p-3">
        <h3 className="h5 text-left">Game over</h3>

        <p className="text-left text-muted mb-0">You have completed a tree.</p>
      </div>
      <div className="d-flex justify-content-between border-top">
        {showHoi ? (
          <div className="btn btn-text text-muted bg-light btn-block m-0 p-3">
            Hoi
          </div>
        ) : (
          <button
            className="btn btn-text rounded-0 text-primary bg-light btn-block m-0 p-3"
            onClick={() => setShowHoi(true)}
          >
            Please press this button
          </button>
        )}
      </div>
    </div>
  );
};

export default GameOver;
