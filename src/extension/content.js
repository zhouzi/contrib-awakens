/* global window */

import sample from 'lodash/sample';
import log from './log';
import createCarDodge from './games/carDodge';

const games = [
  createCarDodge,
];
const createGame = sample(games);

(function startGame() {
  createGame(() => {
    log('Game Over!');
    startGame();
  });
}());
