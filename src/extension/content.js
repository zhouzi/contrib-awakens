/* global window */

import sample from 'lodash/sample';
import createCarDodge from './games/carDodge';

const games = [
  createCarDodge,
];
const createGame = sample(games);

(function startGame() {
  createGame(() => {
    window.alert('Game Over!');// eslint-disable-line no-alert
    startGame();
  });
}());
