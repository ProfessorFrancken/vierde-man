import React from 'react';
import styled from 'styled-components';
import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';

const StyledAside = styled.aside`
  grid-area: side;
  overflow: auto;
`;

const NewsAlert = () => {
  return (
    <div className="alert alert-primary flex-grow-1 mb-4">
      <FontAwesomeIcon icon={faNewspaper} className="mr-2" fixedWidth />
      The interface got an update! Don't like it? Go and complain on
      <a
        href="https://github.com/ProfessorFrancken/vierde-man/issues"
        className="font-weight-bold"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faGithub} className="mx-1 ml-2" />
        Github
      </a>
      .
    </div>
  );
};
const PointsPerCardTable = () => {
  return (
    <table className="table table-striped my-0">
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

const KlaverJasRules = () => {
  return (
    <div className="p-4 border-top bg-white">
      <h3 className="mb-3">Klaverjas rules</h3>

      <h4 className="h6 font-weight-bold mb-1">Which card to play?</h4>
      <p className="mb-0 mt-2">If trump is asked:</p>
      <ol className="pl-3">
        <li>Follow suit and play a higher trump (overtroeven)</li>
        <li>No higher trump? Play a lower trump (ondertroeven)</li>
        <li>No trump? Play another suit.</li>
      </ol>
      <p className="mb-0 mt-2">If non-trump is asked:</p>
      <ol className="pl-3">
        <li>Follow suit.</li>
        <li>Can't follow suit? Play a trump.</li>
        <li>An opponent already played a trump? Play a higher trump.</li>
        <li>No higher trump? Play another suit.</li>
      </ol>
      <h4 className="h6 font-weight-bold mb-1">Honor</h4>
      <p className="mb-1 mt-2">
        If your opponents are going to win the trick (or if you're not sure
        whose it's going to be), avoid playing the following combinations:
      </p>
      <ul className="pl-3 mb-1">
        <li>Straight of three or four cards.</li>
        <li>King and Queen of trump.</li>
      </ul>
      <p className="mt-1">
        Do play these combinations when it's going to be your (or your
        partner's) trick!
      </p>
      <h4 className="h6 font-weight-bold mb-1">Bidding</h4>
      <p className="mb-1 mt-2">
        Not sure what to bid or confused about your partner's bid? These
        guidelines could be useful.
      </p>
      <ul className="pl-3">
        <li>
          80: a Jack plus another card of the same suit / a 9 plus another two
          or three cards of the same suit.
        </li>
        <li>
          90: a Jack plus two other cards of that same suit / a Jack and 9 of
          the same suit.
        </li>
      </ul>
      <h4 className="h6 font-weight-bold mb-1">Seinen</h4>
      <p className="mb-1 mt-2">
        When you can't follow suit and think your partner will win the trick
        (and you don't have to trump), you could play a card that gives them
        extra information.
      </p>
      <ul className="pl-3">
        <li>7, 8 or 9 will tell that you have the Ace of that suit.</li>
        <li>
          Jack, Queen, King or 10 will tell that you don't have the Ace of that
          suit.
        </li>
        <li>Ace will tell that you also have the 10 of that suit.</li>
      </ul>
      <h4 className="h6 font-weight-bold mb-1">Concepts</h4>
      <ul className="pl-3">
        <li>
          <em>Wet:</em> you did not make the amount of points of your bid.
        </li>
        <li>
          <em>Pit:</em> all the tricks went to your team, giving you not only
          all the 162 points, but also 100 points of fame..
        </li>
        <li>
          <em>Verzaken:</em> fail to trump or follow suit, while you could and
          should (currently not in this game).
        </li>
        <li>
          <em>Aas duiken:</em> not playing your Ace, while you actually would
          win the trick by playing it.
        </li>
        <li>
          <em>Bieden 2.0:</em> a bidding system where the players start with a
          bid on the suit they don't want to play. Highly confusing for everyone
          involved.
        </li>
      </ul>
    </div>
  );
};

export const Aside = () => {
  // TODO: use this for displaying
  // Chat
  // People online
  // News
  // Rules
  return (
    <StyledAside className="my-4 container-fluid">
      <div className="bg-light shadow-sm border rounded">
        <div className="p-4 pb-0">
          <NewsAlert />

          <h3 className="h5 font-weight-bold">Tips</h3>
          <p>
            <strong>Want to switch to another device?</strong> Leave your
            current game to join on your other device.
          </p>
          <p>
            <strong>Is the game not updating?</strong> Your internet connection
            may have switched, refreshing the webpage often helps.
          </p>

          <h3 className="h5 font-weight-bold mb-0">Points table</h3>
        </div>

        <PointsPerCardTable />

        <KlaverJasRules />
      </div>
    </StyledAside>
  );
};
