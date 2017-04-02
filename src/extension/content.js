/* global window */

import sample from 'lodash/sample';
import log from './log';
import createCarDodge from './games/carDodge';
import createCrossRoad from './games/crossRoad';

const games = [
  createCarDodge,
  createCrossRoad,
];
const createGame = sample(games);

(function startGame() {
  createGame(() => {
    log('Game Over!');
    startGame();
  });
}());
