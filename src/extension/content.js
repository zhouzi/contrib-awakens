/* global window */

import createCarDodge from './games/carDodge';

function startGame() {
  createCarDodge(() => {
    window.alert('Game Over!');// eslint-disable-line no-alert
    startGame();
  });
}

startGame();
