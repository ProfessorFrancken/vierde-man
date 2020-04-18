import React, { useState } from 'react';
import Modal from 'Components/Modal';
import TreeTable from 'App/TreeTable';
import { useGame } from 'game/context';

const GameOver = () => {
  const [showHoi, setShowHoi] = useState(false);
  const {
    game: { rounds },
  } = useGame();

  return (
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>Game Over</Modal.Title>
        <p className="text-left text-muted mb-0">You have completed a tree.</p>
      </Modal.Header>
      <TreeTable rounds={rounds} />
      <Modal.Footer className="border-0">
        {showHoi ? (
          <Modal.Body className="p-3 text-center">Hoi</Modal.Body>
        ) : (
          <Modal.Actions>
            <Modal.Action onClick={() => setShowHoi(true)} primary>
              Please press this button
            </Modal.Action>
          </Modal.Actions>
        )}
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default GameOver;
