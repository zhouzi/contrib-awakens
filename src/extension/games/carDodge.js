/* global window */

import sample from 'lodash/sample';
import times from 'lodash/times';
import random from 'lodash/random';
import createGame, { Shape, bounds, loop, createLooper, keyCodes, onKeyDown } from '../../lib';
import colors from '../../lib/colors.json';

export default function (onGameOver) {
  let state = createGame();

  const car = Shape('car', [
    [colors.LOW, colors.LOW],
  ]);
  state = state.position(car, [bounds.x.min + 1, bounds.y.middle]);

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

      state = state.move(brick, [-1, 0], (s, collidingPoints) => {
        if (collidingPoints.some(({ name }) => name === 'car')) {
          return null;
        }

        return s;
      });

      if (state == null) {
        onGameOver();
        return;
      }
    }

    bricks = bricks.filter((brick) => {
      const shouldRemove = state.isOutOfBounds(brick) === 1;
      if (shouldRemove) {
        state = state.removeShape(brick);
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
    state = state.position(brick, [x, y]);
  }

  const minDelay = 100;
  const maxDelay = 800;
  let delayBetweenBrickMoves = maxDelay;
  loop(createLooper(() => {
    moveBricks();

    if (state != null && random(1, 2) === 1) {
      spawnBrick();
    }

    return delayBetweenBrickMoves;
  }));

  loop(() => {
    if (state != null) {
      state.render();
    }
  });

  function moveCar(direction) {
    const coord = direction === 'top' ? [0, -1] : [0, 1];
    const nextState = state.move(car, coord, () => null);

    if (nextState == null) {
      onGameOver();
    } else if (nextState.isOutOfBounds(car) === 0) {
      state = nextState;
    }
  }

  onKeyDown(keyCodes.TOP, () => moveCar('top'));
  onKeyDown(keyCodes.BOTTOM, () => moveCar('bottom'));

  const delayDecrement = 50;
  onKeyDown(keyCodes.RIGHT, () => {
    delayBetweenBrickMoves = Math.max(minDelay, delayBetweenBrickMoves - delayDecrement);
  });

  onKeyDown(keyCodes.LEFT, () => {
    delayBetweenBrickMoves = Math.min(maxDelay, delayBetweenBrickMoves + delayDecrement);
  });
}
