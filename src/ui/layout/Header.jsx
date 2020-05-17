import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Francken } from 'assets/LOGO_KAAL.svg';

const StyledHeader = styled.div`
  --skew-degrees: 30deg;
  --negative-skew-degrees: -30deg;
  --bg-color: ${({ theme }) => theme.primary};

  background-color: var(--bg-color);
  position: relative;

  height: 6em;
  z-index: 3;
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
    z-index: 2;

    margin-left: -4em;
    width: 4em;
    margin-left: 5.5em;
  }

  a {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
  }

  .header__logo {
    color: white;
    background-color: var(--bg-color);
    width: 100%;
    z-index: 2;

    svg {
      z-index: 10;
      max-width: 100%;
      max-height: 50px;
    }
  }

  @media (min-width: 576px) {
    height: 7em;

    &:before {
      width: 6em;
      margin-left: 5em;
    }
  }

  @media (min-width: 768px) {
    .header__logo {
      border-radius: 0px 0px 10px 0px;
      width: 200px;

      svg {
        max-height: 60px;
      }
    }

    &:before {
      width: unset;
      margin-left: 0em;
    }
  }

  @media (min-width: 992px) {
    .header__logo {
      width: 300px;
      svg {
        max-height: 70px;
      }
    }
  }

  @media (min-width: 1200px) {
    &:before {
      margin-right: 0;
      margin-left: 0;
      width: unset;
    }
  }
`;

export const Header = () => {
  return (
    <StyledHeader className="francken-header">
      <div className="header__logo">
        <a className="d-inline-flex flex-column" href="/">
          <Francken height="100px" />
        </a>
      </div>
    </StyledHeader>
  );
};
