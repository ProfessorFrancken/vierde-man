import React, { useState } from 'react';
import Modal from 'Components/Modal';

const GameOver = () => {
  const [showHoi, setShowHoi] = useState(false);

  console.log(showHoi);

  return (
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>Game Over</Modal.Title>
        <p className="text-left text-muted mb-0">You have completed a tree.</p>
      </Modal.Header>
      <Modal.Footer>
        {showHoi ? (
          <div className="btn btn-text text-muted bg-light btn-block m-0 p-3">
            Hoi
          </div>
        ) : (
          <Modal.Actions>
            <Modal.Action onClick={() => setShowHoi(true)}>
              Please press this button
            </Modal.Action>
          </Modal.Actions>
        )}
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default GameOver;
