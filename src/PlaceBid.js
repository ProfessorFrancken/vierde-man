import React from 'react';
import styled from 'styled-components';
import { Spades, Hearts, Diamonds, Clubs, Sans } from 'Components/Suits';

const isSans = event => event.value === 'sans';

const bids = event =>
  isSans(event)
    ? [70, 80, 90, 100, 110, 120, 130, 'pit', 'pitje + roem']
    : [80, 90, 100, 110, 120, 130, 140, 150, 160, 'pit', 'pitje + roem'];

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Suites = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const SuiteButton = styled.button`
  height: 100%;
  background: ${({ selected }) => (selected ? '#eeeeee' : '')};
`;

const SelectSuite = ({ children, ...props }) => (
  <div
    className={`h-100 d-flex justify-content-center align-items-center my-0 py-0 ${
      props.selected ? 'bg-gray border-left border-top border-bottom' : ''
    }`}
  >
    <SuiteButton
      selected={props.selecterd}
      className={` btn btn-block h-100 btn-text py-0 my-0 h-100`}
      {...props}
    >
      {children}
    </SuiteButton>
  </div>
);

const BidValues = styled.ul`
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  display: grid;
  grid-auto-flow: column;
  justify-items: stretch;
  align-items: stretch;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: repeat(5, 1fr);
  background-color: #eeeeee;
`;

// grid-template-columns: 1fr 1fr 1fr;
const SelectBid = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BidButton = styled.button`
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  text-decoration: ${({ selected }) => (selected ? 'underline' : 'none')};
`;

const PlaceBid = ({
  id,
  selectedSuit = id === 1 ? 'sans' : 'hearts',
  selectedBid = 90
}) => {
  const possibleBids = bids({ value: selectedSuit });

  return (
    <>
      <h3>Place a bid</h3>

      <SelectBid className="w-100 h-100 p-4">
        <Suites className="list-unstyled mb-0">
          <SelectSuite selected={selectedSuit === 'spades'}>
            <Spades />
          </SelectSuite>
          <SelectSuite selected={selectedSuit === 'hearts'}>
            <Hearts />
          </SelectSuite>
          <SelectSuite selected={selectedSuit === 'diamonds'}>
            <Diamonds />
          </SelectSuite>
          <SelectSuite selected={selectedSuit === 'clubs'}>
            <Clubs />
          </SelectSuite>
          <SelectSuite selected={selectedSuit === 'sans'}>
            <Sans />
          </SelectSuite>
        </Suites>

        <BidValues className="list-unstyled mb-0">
          {possibleBids.map((bid, idx) => (
            <li
              className="d-flex justify-content-center align-items-center "
              key={idx}
            >
              <BidButton
                className="btn btn-block btn-text h-100"
                selected={selectedBid === bid}
              >
                {bid}
              </BidButton>
            </li>
          ))}
        </BidValues>
      </SelectBid>

      <Actions>
        <button className="btn btn-lg btn-outline-primary">Place bid</button>
        <button className="btn btn-lg btn-outline-primary">
          Pass for 100 <Spades />
        </button>
      </Actions>
    </>
  );
};

export default PlaceBid;
