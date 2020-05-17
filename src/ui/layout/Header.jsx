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

    margin-left: -4em;
    width: 4em;
    margin-left: 5.5em;
  }

  a {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .header__logo {
    background-color: var(--bg-color);

    svg {
      max-width: 100%;
      max-height: 50px;
    }
  }

  @media (min-width: 576px) {
    height: 7em;

    &:before {
      width: 5em;
      margin-left: 5em;
    }
  }

  @media (min-width: 768px) {
    .header__logo svg {
      max-height: 60px;
    }

    &:before {
      width: unset;
      margin-left: 0em;
    }
  }

  @media (min-width: 992px) {
    .header__logo svg {
      max-height: 70px;
    }
  }
`;

export const Header = () => {
  return (
    <StyledHeader className="francken-header">
      <div className="header__logo text-white bg-primary">
        <a className="d-inline-flex flex-column" href="/">
          <Francken height="100px" />
        </a>
      </div>
    </StyledHeader>
  );
};
