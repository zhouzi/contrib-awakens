/* global window */

import sample from 'lodash/sample';
import times from 'lodash/times';
import random from 'lodash/random';
import createGame, { Shape, bounds, loop, createLooper, keyCodes, onKeyDown } from '../../lib';
import colors from '../../lib/colors.json';

export default function (onGameOver) {
  const car = Shape('car', [
    [colors.LOW, colors.LOW],
  ]);

  let state = createGame();

  // position the car to the left
  state = state.position(car, [bounds.x.min + 1, bounds.y.middle]);

  // bricks have random colors
  // below is the list of the possible ones
  const bricksColor = [
    colors.HIGH,
    colors.VERY_HIGH,
  ];

  // createBrick returns bricks of random
  // shapes (colors and length)
  function createBrick() {
    const color = sample(bricksColor);
    const length = random(1, 2);
    return Shape('brick', times(length, () => [color]));
  }

  // keep reference to all bricks
  let bricks = [];

  // move bricks to the left
  function moveBricks() {
    // use a for loop and not .reduce() because
    // we want to return early in the case of a brick
    // colliding with the car
    for (let i = 0; i < bricks.length; i += 1) {
      const brick = bricks[i];

      // move the brick to the left
      state = state.move(brick, [-1, 0], (s, collidingPoints) => {
        // this function is called when a brick collides with
        // something else
        // since we're moving the bricks to the most left first
        // the only possible colliding shape is the car
        // still, below we're checking that the car is effectively one
        // of the colliding shapes
        if (collidingPoints.some(({ name }) => name === 'car')) {
          // below is the return value of move()
          // when there are colliding shapes
          // we're setting state to null as a way to tell
          // that the game's over
          return null;
        }

        // nothing bad happened, just go on
        return s;
      });

      // state is null, it means the game is over
      if (state == null) {
        onGameOver();

        // no need to go further, just stop the execution
        return;
      }
    }

    // shapes that are out of bounds are not automatically
    // removed so we need to do it ourselves
    bricks = bricks.filter((brick) => {
      // isOutOfBounds returns the percentage of the shape
      // to be out of bounds (an int between 0 and 1)
      const shouldRemove = state.isOutOfBounds(brick) === 1;
      if (shouldRemove) {
        // remove this shape from the state
        // we don't need it anymore
        state = state.removeShape(brick);

        // returning false here will also filter out
        // the brick from our bricks array
        return false;
      }

      return true;
    });
  }

  // spawn a random brick at a random position to the most right
  function spawnBrick() {
    // create the brick and add it to the rest
    const brick = createBrick();
    bricks.push(brick);

    // we want it to be to the most right
    const x = bounds.x.max;

    // randomly somewhere on the y axis
    const y = random(bounds.y.min, bounds.y.max);

    state = state.position(brick, [x, y]);
  }

  const minDelay = 100;
  const maxDelay = 800;
  let delayBetweenBrickMoves = maxDelay;
  loop(createLooper(() => {
    // move all the bricks by 1 to the left
    moveBricks();

    // moveBricks make have caused a game over
    // in such case, stop the execution
    // otherwise there's 50% change to spawn a brick
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

    // just like the bricks, if the car moves
    // into a brick, it's game over
    if (nextState == null) {
      onGameOver();
    } else if (nextState.isOutOfBounds(car) === 0) {
      // also, prevent the car from moving out of the bounds
      state = nextState;
    }
  }

  onKeyDown(keyCodes.TOP, () => moveCar('top'));
  onKeyDown(keyCodes.BOTTOM, () => moveCar('bottom'));

  const delayDecrement = 50;
  onKeyDown(keyCodes.RIGHT, () => {
    // when pressing right, the car accelerates
    // technically it just means the bricks are moving and spawning faster
    delayBetweenBrickMoves = Math.max(minDelay, delayBetweenBrickMoves - delayDecrement);
  });

  onKeyDown(keyCodes.LEFT, () => {
    // when pressing left, the car decelerates
    // which means the bricks are moving and spawning slower
    delayBetweenBrickMoves = Math.min(maxDelay, delayBetweenBrickMoves + delayDecrement);
  });
}
