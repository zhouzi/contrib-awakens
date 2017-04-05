/* global window */

import sample from 'lodash/sample';
import log from './log';
import createCarDodge from './games/carDodge';
import createCrossRoad from './games/crossRoad';
import createSpaceInvaders from './games/spaceInvaders';
import { hasGraph } from '../lib/DOM';

if (hasGraph()) {
  const games = [
    createCarDodge,
    createCrossRoad,
    createSpaceInvaders,
  ];
  const createGame = sample(games);

  (function startGame() {
    createGame(() => {
      log('Game Over!');
      startGame();
    });
  }());
}
