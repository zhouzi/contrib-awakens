/* global window */

import sample from 'lodash/sample';
import times from 'lodash/times';
import random from 'lodash/random';
import log from '../log';
import getInitialState, { bounds } from '../../lib';
import position from '../../lib/position';
import move from '../../lib/move';
import Shape from '../../lib/Shape';
import isOutOfBounds from '../../lib/isOutOfBounds';
import { removeOutOfBoundsShape } from '../../lib/removeShape';
import { reduceLeft, filterShapes } from '../../lib/reduce';
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

  if (isOutOfBounds(nextState, car) > 0) {
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
  return reduceLeft(state, filterShapes((currentState, shape) => (
    move(currentState, shape, [-1, 0], () => null)
  ), 'brick'));
}

function spawnBrick(state) {
  const brick = createBrick();
  const x = bounds.x.max;
  const y = random(bounds.y.min, bounds.y.max);
  return position(state, brick, [x, y]);
}

function moveAndSpawnBricks(state) {
  const nextState = moveBricks(state);

  if (nextState == null) {
    return null;
  }

  if (random(1, 2) === 1) {
    return spawnBrick(nextState);
  }

  return nextState;
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
    state = moveAndSpawnBricks(state);
  }, initialDelay, minDelay, maxDelay);

  const speedDelay = 50;
  onKeyDown({
    [keyCodes.RIGHT]: () => bricksLoop.decrementDelay(speedDelay),
    [keyCodes.LEFT]: () => bricksLoop.incrementDelay(speedDelay),
    [keyCodes.TOP]: () => { state = moveCar(state, 'top'); },
    [keyCodes.BOTTOM]: () => { state = moveCar(state, 'bottom'); },
  });

  loop(() => {
    if (state == null) {
      gameOver();
    } else {
      state = reduceLeft(state, removeOutOfBoundsShape);
      render(state);
    }
  });
}
