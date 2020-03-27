import React from 'react';
import { Client } from 'boardgame.io/react';
import { KlaverJassen } from 'GameLogic/Game';
import { useForm } from 'react-hook-form';
// import { PlaceBid, Pass } from 'Phases/PlaceBids';
// import { PlayCard } from 'Phases/PlayTricks';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import {
  SuitStringToComponent,
  Spades,
  Hearts,
  Diamonds,
  Clubs,
  Sans
} from 'Suits';
import PlaceBid from 'PlaceBid';
import { SUITES, SANS } from 'GameLogic/Card';
const { SPADES, HEARTS, CLUBS, DIAMONDS } = SUITES;

const isSans = event => event.value === 'sans';

const bids = event =>
  isSans(event)
    ? [70, 80, 90, 100, 110, 120, 130, 'pit', 'pitje met roem']
    : [80, 90, 100, 110, 120, 130, 140, 150, 160, 'pit', 'pitje met roem'];

const PlayerGrid = styled.div`
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'player-1 player-2'
    'player-4 player-3';
`;

const PlayerContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
  border: thin solid #dddddd;
  grid-area: ${props => 'player-' + props.id};
  background-color: ${props =>
    props.id === 1 || props.id === 3 ? '#fafafa' : '#fafefa'};
`;

const PlayerHand = styled.ul`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  li {
    background: white;
    margin: 1rem;
  }
`;

const Player = ({
  id,
  name,
  cards = [],
  selectedSuit = id === 1 ? 'sans' : 'hearts',
  selectedBid = 90,
  moves,
  game,
  phase,
  currentPlayer
}) => {
  const { selectBid, handleSubmit, watch, errors } = useForm();

  const playerHand = game.hands[id];

  const possibleBids = bids({ value: selectedSuit });

  if (currentPlayer !== id) {
    return (
      <PlayerContainer id={id + 1} className="p-5">
        <h1>{name}</h1>
        <small>{phase}</small>
        HOI
      </PlayerContainer>
    );
  }

  return (
    <PlayerContainer id={id + 1} className="p-5">
      <h1>{name}</h1>
      <small>{phase}</small>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="suit">Select suit</label>
            <select className="form-control" id="suit">
              <option>SANS</option>
              <option>Spades</option>
              <option>Diamonds</option>
              <option>Hearts</option>
              <option>Clubs</option>
            </select>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label htmlFor="bid">Select bid</label>
            <select className="form-control" id="bid">
              <option>70</option>
              <option>80</option>
              <option>90</option>
              <option>100</option>
              <option>110</option>
              <option>120</option>
              <option>130</option>
              <option>140</option>
              <option>150</option>
              <option>160</option>
            </select>
          </div>
        </div>
        <div className="col">
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-primary"
              type="submit"
              onClick={() => {
                const result = moves.PlaceBid({ suit: CLUBS, bid: '90' });
                console.log({ result });
                return;
              }}
            >
              Submit bid
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              onClick={() => {
                const result = moves.Pass();
                console.log({ result });
                return;
              }}
            >
              Pass
            </button>
          </div>
        </div>
      </div>

      {1 === 2 && id === 0 && cards.length === 0 && <PlaceBid id={id + 1} />}
      {1 === 3 && id === 0 && cards.legnth !== 0 && <div>HOI</div>}
      {id === 1 && (
        <>
          <h3 className="text-muted text-center mx-auto">
            Waiting for first bid
          </h3>
          <h3>Waiting</h3>{' '}
        </>
      )}
      {id === 2 && (
        <>
          <h3 className="text-muted text-center mx-auto">
            100 <Spades />
          </h3>
          <h3>Waiting</h3>
        </>
      )}
      {id === 3 && (
        <>
          <h3 className="text-muted text-center mx-auto">Pass</h3>
          <h3>Waiting</h3>
        </>
      )}
      <PlayerHand className="list-unstyled">
        {playerHand.map(({ suit, face }, idx) => (
          <li
            className="p-3 py-5 font-weight-bold d-flex align-items-center justify-content-center"
            onClick={() => {
              moves.PlayCard({ suit, face });
            }}
            key={idx}
          >
            <SuitStringToComponent suit={suit} />
            <span className="mx-3">{face}</span>
          </li>
        ))}
      </PlayerHand>
    </PlayerContainer>
  );
};

const Notes = G => {
  const Bid = ({ bid }) => {
    if (!bid) {
      return 'No known bid';
    }
    return (
      <div>
        <h3>
          Bid by:
          <small>{bid.highestBidBy}</small>
          <small>
            {bid.bid}
            <SuitStringToComponent suit={bid.trump} />
          </small>
        </h3>
      </div>
    );
  };
  const Boompje = () => (
    <div>
      <h3>Boompje</h3>
      <h4>Tak 1</h4>
      <h4>Tak 2</h4>
      <h4>Tak 3</h4>
      <h4>Tak 4</h4>
    </div>
  );
  const CurrentTrick = ({ currentTrick }) => {
    return (
      <div className="flex-grow-1 w-100">
        <ul className="list-unstyled">
          <li>
            <h4>Starting player</h4>
            {currentTrick.startingPlayer}
          </li>
          <li>
            <h4>Played cards</h4>
            <ul class="list-unstyled d-flex justify-content-between">
              {[0, 1, 2, 3].map(id => (
                <li className="bg-light p-4 m-3">
                  Player {id}:
                  {currentTrick.playedCards[id] === undefined ? (
                    'Waiting'
                  ) : (
                    <div>
                      {currentTrick.playedCards[id].face}
                      <SuitStringToComponent
                        suit={currentTrick.playedCards[id].suit}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    );
  };

  const CurrentHand = G => {
    return (
      <ul className="list-unstyled">
        <li>
          <CurrentTrick {...G} />
        </li>
        {G.playedTricks.map(trick => {
          return (
            <li>
              <p> winner: {trick.winner} </p>
              <p> points: {trick.points} </p>
              <p> honor: {trick.honor} </p>
              <p>
                {' '}
                cards:
                <ul class="list-unstyled d-flex justify-content-between">
                  {[0, 1, 2, 3].map(id => (
                    <li className="bg-light p-4 m-3">
                      {trick.cards[id].face}
                      <SuitStringToComponent suit={trick.cards[id].suit} />
                    </li>
                  ))}
                </ul>
              </p>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div>
      <Bid {...G} />
      <CurrentHand {...G} />
      <Boompje {...G} />
    </div>
  );
};

const App = props => {
  const { G, moves, ctx } = props;
  const { phase } = ctx;

  return (
    <div className="App">
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column">
              <div>
                Wij: {G.wij} | Zij: {G.zij}
              </div>
              <div>
                Wij: {G.wij} | Zij: {G.zij}
                {/* Wij: {G.rounds.filter(({ winner }) => [0, 2].includes(winner)).map(({ points })} | Zij: {G.zij} */}
              </div>
            </div>
            <div>
              {G.trump} ({G.bid.bid})
            </div>
          </div>
          <PlayerGrid>
            <Player
              id={0}
              name="Mark"
              game={G}
              moves={moves}
              phase={phase}
              currentPlayer={parseInt(ctx.currentPlayer, 10)}
            />
            <Player
              id={1}
              name="Anna"
              game={G}
              moves={moves}
              phase={phase}
              currentPlayer={parseInt(ctx.currentPlayer, 10)}
            />
            <Player
              id={2}
              name="Arjen"
              game={G}
              moves={moves}
              phase={phase}
              currentPlayer={parseInt(ctx.currentPlayer, 10)}
            />
            <Player
              id={3}
              name="Su"
              game={G}
              moves={moves}
              phase={phase}
              currentPlayer={parseInt(ctx.currentPlayer, 10)}
            />
          </PlayerGrid>
        </div>
        <Notes {...G} />
      </div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

const KlaverJasApp = Client({
  game: KlaverJassen,
  numPlayers: 4,
  debug: true,
  // debug: true,
  board: App,
  loading: props => {
    return 'Loading component';
  }
});

export default KlaverJasApp;
// export default App
