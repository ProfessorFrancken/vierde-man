import React from 'react';
import styled from 'styled-components';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { Aside } from './Aside';

const LayoutStyle = styled.div`
  // Set the border width of the border above the navigation
  --top-stroke-width: 0.75em;
  border-top: var(--top-stroke-width) solid ${({ theme }) => theme.primary};

  // grid-template-areas:
  //   'header content side'
  //   'nav content side'
  //   'footer footer footer';

  // grid-template-columns: 18em 1fr minmax(35em, 200px);
  // grid-template-rows: auto 1fr auto;
  grid-column-gap: 0em;

  min-height: 100vh;
  min-width: 100%;

  .francken-header {
    grid-area: header;
    @media (min-width: 768px) {
      margin-right: 5em;
    }
  }

  .francken-navigation {
    position: sticky;
    grid-row: 1;
    grid-column: 1/3;
    @media (min-width: 768px) {
      grid-area: nav;
      margin-right: 5em;
    }
  }

  .francken-content {
    grid-area: content;
    overflow: auto;
  }

  display: grid;
  grid-template-areas:
    'header nav'
    'content content'
    'side side'
    'footer footer';

  grid-template-columns: minmax(4em, 9em) auto;
  // Small devices (landscape phones, 576px and up)
  @media (min-width: 576px) {
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) {
    grid-template-rows: auto;
    display: grid;
    grid-template-areas:
      'header content'
      'nav content'
      'nav side'
      'footer footer';

    grid-template-columns: 18em 1fr;
    grid-template-rows: auto 1fr auto auto;
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
  }

  // Extra large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) {
    max-height: 100vh;
    grid-template-columns: 18em 1fr minmax(35em, 200px);
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      'header content side'
      'nav content side'
      'footer footer footer';
  }
`;

const Layout = ({ children }) => {
  return (
    <LayoutStyle className="francken-layout">
      <Header />
      <Navigation />
      <main className="francken-content my-4">{children}</main>
      <Aside />
    </LayoutStyle>
  );
};

export default Layout;
