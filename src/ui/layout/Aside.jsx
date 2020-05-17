import React from 'react';
import styled from 'styled-components';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledAside = styled.aside`
  grid-area: side;
  overflow: auto;
`;

const FranckenDiscordAlert = () => {
  return (
    <div className="alert alert-primary flex-grow-1 mb-4">
      <FontAwesomeIcon icon={faDiscord} className="mr-2" fixedWidth />
      Join the{' '}
      <a
        href="https://discord.gg/gHb2jUq"
        className="font-weight-bold"
        target="_blank"
        rel="noopener noreferrer"
      >
        Francken Discord
      </a>{' '}
      to chat while playing .
    </div>
  );
};

const PointsPerCardTable = () => {
  return (
    <table className="table my-4 border-bottom ">
      <thead>
        <tr>
          <th className="text-right">Trump</th>
          <th>Points</th>
          <th className="text-right">Non-trump</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="text-right">Jack</td>
          <td>20</td>
          <td className="text-right">Ace</td>
          <td>11</td>
        </tr>
        <tr>
          <td className="text-right">9</td>
          <td>14</td>
          <td className="text-right">10</td>
          <td>10</td>
        </tr>
        <tr>
          <td className="text-right">Ace</td>
          <td>11</td>
          <td className="text-right">King</td>
          <td>4</td>
        </tr>
        <tr>
          <td className="text-right">10</td>
          <td>10</td>
          <td className="text-right">Queen</td>
          <td>3</td>
        </tr>
        <tr>
          <td className="text-right">King</td>
          <td>4</td>
          <td className="text-right">Jack</td>
          <td>2</td>
        </tr>
        <tr>
          <td className="text-right">Queen</td>
          <td>3</td>
          <td className="text-right">9</td>
          <td>0</td>
        </tr>
        <tr>
          <td className="text-right">8</td>
          <td>0</td>
          <td className="text-right">8</td>
          <td>0</td>
        </tr>
        <tr>
          <td className="text-right">7</td>
          <td>0</td>
          <td className="text-right">7</td>
          <td>0</td>
        </tr>
      </tbody>
    </table>
  );
};

export const Aside = () => {
  return (
    <StyledAside className="my-4 container-fluid">
      <div className="p-4 bg-light">
        <FranckenDiscordAlert />

        <h3>Klaverjas rules</h3>
        <PointsPerCardTable />
        <h5>Honor</h5>
        <p className="text-muted">
          Feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper
          morbi? Risus pretium quam vulputate dignissim suspendisse in est ante
          in nibh mauris, cursus mattis molestie a, iaculis at erat
          pellentesque.
        </p>
        <h5>Bidding</h5>
        <p className="text-muted">
          Quisque sagittis, purus sit amet volutpat consequat, mauris nunc
          congue.
        </p>
        <h5>Seinen</h5>
        <p className="text-muted">
          Amet facilisis magna etiam tempor, orci eu lobortis elementum, nibh.
        </p>
        <h5>Concepts</h5>
        <p className="text-muted">
          Nisi, vitae suscipit tellus mauris a diam maecenas.
        </p>
      </div>
    </StyledAside>
  );
};
