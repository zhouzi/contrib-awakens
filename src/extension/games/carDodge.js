/* global window */

import sample from 'lodash/sample';
import times from 'lodash/times';
import random from 'lodash/random';
import log from '../log';
import getInitialState, { bounds } from '../../lib';
import position from '../../lib/position';
import move from '../../lib/move';
import Shape, { getShapeMeta } from '../../lib/Shape';
import isOutOfBounds from '../../lib/isOutOfBounds';
import removeShape from '../../lib/removeShape';
import { reduceLeft } from '../../lib/reduce';
import render from '../../lib/DOM';
import loop from '../../lib/DOM/loop';
import onKeyDown, { keyCodes } from '../../lib/DOM/keyboard';
import clear from '../../lib/DOM/clear';
import colors from '../../lib/colors.json';

const car = Shape('car', [
  [colors.LOW, colors.LOW],
]);
function moveCar(state, direction) {
  const coord = direction === 'top' ? [0, -1] : [0, 1];
  const nextState = move(state, car, coord, () => null);

  if (nextState == null) {
    return null;
  }

  if (isOutOfBounds(state, car) > 0) {
    return state;
  }

  return nextState;
}

const bricksColor = [
  colors.HIGH,
  colors.VERY_HIGH,
];
function createBrick() {
  const color = sample(bricksColor);
  const length = random(1, 2);
  return Shape('brick', times(length, () => [color]));
}

function moveBricks(state) {
  return reduceLeft(state, (currentState, shape) => {
    if (getShapeMeta(shape).name === 'brick') {
      const nextState = move(currentState, shape, [-1, 0], () => null);
      if (nextState == null) {
        return nextState;
      }

      if (isOutOfBounds(nextState, shape) === 1) {
        return removeShape(nextState, shape);
      }

      return nextState;
    }

    return currentState;
  });
}

function spawnBrick(state) {
  const brick = createBrick();
  const x = bounds.x.max;
  const y = random(bounds.y.min, bounds.y.max);
  return position(state, brick, [x, y]);
}

export default function (onGameOver) {
  log(
    'Press top to move top',
    'Press bottom to move bottom',
    'Press right to accelerate',
    'Press left to decelerate',
  );

  let state = position(
    getInitialState(),
    car,
    [bounds.x.min + 1, bounds.y.middle],
  );

  function gameOver() {
    clear();
    onGameOver();
  }

  const minDelay = 100;
  const maxDelay = 800;
  const initialDelay = Math.round((maxDelay - minDelay) / 2);
  const bricksLoop = loop(() => {
    state = moveBricks(state);

    if (state == null) {
      gameOver();
      return;
    }

    if (random(1, 2) === 1) {
      state = spawnBrick(state);
    }
  }, initialDelay, minDelay, maxDelay);

  const speedDelay = 50;
  onKeyDown(keyCodes.RIGHT, () => bricksLoop.decrementDelay(speedDelay));
  onKeyDown(keyCodes.LEFT, () => bricksLoop.incrementDelay(speedDelay));

  onKeyDown(keyCodes.TOP, () => {
    state = moveCar(state, 'top');
    if (state == null) {
      gameOver();
    }
  });
  onKeyDown(keyCodes.BOTTOM, () => {
    state = moveCar(state, 'bottom');
    if (state == null) {
      gameOver();
    }
  });

  loop(() => render(state));
}
