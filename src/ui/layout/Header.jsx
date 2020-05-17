import React from 'react';
import styled from 'styled-components';

const StyledHeader = styled.div`
  --skew-degrees: 30deg;
  --negative-skew-degrees: -30deg;
  --bg-color: ${({ theme }) => theme.primary};

  background-color: var(--bg-color);
  position: relative;

  height: 6em;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-color);
    transform: skewX(var(--negative-skew-degrees));
    border-radius: 0px 0px 10px 0px;
    transform-origin: bottom right;

    width: 4em;
    margin-left: 1.5em;
  }

  a {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
  }

  .header__logo {
    background-color: var(--bg-color);

    svg {
      max-width: 100%;
      max-height: 60px;
    }
  }

  @media (min-width: 768px) {
    &:before {
      width: unset;
      margin-left: 0em;
    }
  }
`;

export const Header = () => {
  return (
    <StyledHeader className="francken-header">
      <div className="header__logo text-white bg-primary">
        <a className="d-inline-flex flex-column text-center" href="/">
          <h1 className="text-white mb-0">♣</h1>
        </a>
      </div>
    </StyledHeader>
  );
};
