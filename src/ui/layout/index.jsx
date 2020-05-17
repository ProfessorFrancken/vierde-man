import React from 'react';
import styled from 'styled-components';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { Aside } from './Aside';

const LayoutStyle = styled.div`
  // Set the border width of the border above the navigation
  --top-stroke-width: 0.75em;
  --navigation-margin-right: 0em;

  border-top: var(--top-stroke-width) solid ${({ theme }) => theme.primary};

  min-height: 100vh;
  min-width: 100%;

  display: grid;
  grid-column-gap: 0em;
  grid-template-columns: 5em auto;
  grid-template-areas:
    'header nav'
    'content content'
    'side side'
    'footer footer';

  .francken-header {
    grid-area: header;

    margin-right: var(--navigation-margin-right);
  }

  .francken-navigation {
    position: sticky;
    grid-row: 1;
    grid-column: 1/3;

    margin-right: var(--navigation-margin-right);
  }

  .francken-content {
    grid-area: content;
    overflow: auto;
  }

  // Small devices (landscape phones, 576px and up)
  @media (min-width: 576px) {
  }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) {
    --navigation-margin-right: 3em;

    grid-template-rows: auto;
    display: grid;
    grid-template-areas:
      'header content'
      'nav content'
      'nav side'
      'footer footer';

    grid-template-columns: 18em 1fr;
    grid-template-rows: auto 1fr auto auto;

    .francken-navigation {
      grid-area: nav;
    }
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) {
  }

  // Extra large devices (large desktops, 1300px and up)
  // Note: this has specifically been set to 1300px instead of 1200px to improve
  // responsiveness of the aside menu
  @media (min-width: 1300px) {
    max-height: 100vh;
    grid-template-columns: 18em minmax(700px, 1fr) minmax(auto, 30em);
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
