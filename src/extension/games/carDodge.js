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
import removeShape from '../../lib/removeShape';
import render from '../../lib/DOM';
import loop from '../../lib/DOM/loop';
import onKeyDown, { keyCodes } from '../../lib/DOM/keyboard';
import clear from '../../lib/DOM/clear';
import colors from '../../lib/colors.json';

export default function (onGameOver) {
  log(
    'Press top to move top',
    'Press bottom to move bottom',
    'Press right to accelerate',
    'Press left to decelerate',
  );

  let state = getInitialState();

  const car = Shape('car', [
    [colors.LOW, colors.LOW],
  ]);
  state = position(state, car, [bounds.x.min + 1, bounds.y.middle]);

  const bricksColor = [
    colors.HIGH,
    colors.VERY_HIGH,
  ];
  function createBrick() {
    const color = sample(bricksColor);
    const length = random(1, 2);
    return Shape('brick', times(length, () => [color]));
  }

  let bricks = [];
  function moveBricks() {
    for (let i = 0; i < bricks.length; i += 1) {
      const brick = bricks[i];

      state = move(state, brick, [-1, 0], (s, collidingPoints) => {
        if (collidingPoints.some(({ name }) => name === 'car')) {
          return null;
        }

        return s;
      });

      if (state == null) {
        clear();
        onGameOver();
        return;
      }
    }

    bricks = bricks.filter((brick) => {
      const shouldRemove = isOutOfBounds(state, brick) === 1;
      if (shouldRemove) {
        state = removeShape(state, brick);
        return false;
      }

      return true;
    });
  }

  function spawnBrick() {
    const brick = createBrick();
    bricks.push(brick);

    const x = bounds.x.max;
    const y = random(bounds.y.min, bounds.y.max);
    state = position(state, brick, [x, y]);
  }

  const minDelay = 100;
  const maxDelay = 800;
  const initialDelay = Math.round((maxDelay - minDelay) / 2);
  const bricksLoop = loop(() => {
    moveBricks();

    if (state != null && random(1, 2) === 1) {
      spawnBrick();
    }
  }, initialDelay, minDelay, maxDelay);

  loop(() => render(state));

  function moveCar(direction) {
    const coord = direction === 'top' ? [0, -1] : [0, 1];
    const nextState = move(state, car, coord, () => null);

    if (nextState == null) {
      clear();
      onGameOver();
    } else if (isOutOfBounds(state, car) === 0) {
      state = nextState;
    }
  }

  onKeyDown(keyCodes.TOP, () => moveCar('top'));
  onKeyDown(keyCodes.BOTTOM, () => moveCar('bottom'));

  const speedDelay = 50;
  onKeyDown(keyCodes.RIGHT, () => bricksLoop.decrementDelay(speedDelay));
  onKeyDown(keyCodes.LEFT, () => bricksLoop.incrementDelay(speedDelay));
}
