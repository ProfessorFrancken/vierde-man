import React from 'react';

export const LobbyMenu = () => {
  return (
    <div className="d-flex justify-content-between border-bottom">
      <button className="btn btn-block mt-0 bg-white p-3 border-right">
        Public games
      </button>
      <button className="btn btn-block mt-0 bg-light p-3 border-left border-right">
        Your games
        <span class="badge badge-pill badge-primary ml-2">4</span>
      </button>
      <button className="btn btn-block mt-0 bg-light p-3 border-left border-right">
        Previous games
      </button>
    </div>
  );
};
