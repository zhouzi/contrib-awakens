import random from 'lodash/random';
import times from 'lodash/times';
import getInitialState, {
  Shape,
  position,
  move,
  pipeline,
  isOutOfBounds,
  reduceLeft,
  getShapeName,
  removeOutOfBoundsShapes,
  throttle,
  bounds,
  directions,
} from '../lib';
import render, { loop, onKeyDown, onKeyUp, keyCodes } from '../lib/DOM';
import colors from '../lib/colors.json';

const helicopter = Shape('helicopter', [
  [colors.LIGHT],
]);

function moveHelicopter(state, direction) {
  const nextState = move(state, helicopter, direction, () => null);
  if (nextState == null) {
    return null;
  }

  if (isOutOfBounds(nextState, helicopter) === 0) {
    return nextState;
  }

  return state;
}

function createBrick(height, color) {
  return Shape('brick', times(height, () => [color]));
}

function spawnBrick(state) {
  return pipeline([
    (acc) => {
      const topBrickHeight = random(0, 1);

      if (topBrickHeight === 0) {
        return acc;
      }

      const topBrick = createBrick(topBrickHeight, colors.DARK);
      return position(acc, topBrick, [bounds.x.max, bounds.y.min], () => null);
    },
    (acc) => {
      const bottomBrickHeight = random(1, 2);
      const bottomBrick = createBrick(bottomBrickHeight, colors.DARKER);
      return position(acc, bottomBrick, [
        bounds.x.max,
        bounds.y.max - (bottomBrickHeight - 1),
      ], () => null);
    },
  ], state);
}

function moveBricks(state) {
  return reduceLeft(state, (acc, shape) => {
    if (getShapeName(shape) === 'brick') {
      return move(acc, shape, directions.LEFT, () => null);
    }

    return acc;
  });
}

export default function createHelicopter() {
  let state = position(getInitialState(), helicopter, [
    bounds.x.middle - Math.round(bounds.x.middle / 2),
    bounds.y.middle - 1,
  ]);

  const spawnAndMoveBricks = throttle(acc => pipeline([
    moveBricks,
    spawnBrick,
  ], acc), 400, 100, 800);

  const maxSpeed = 2;
  const minSpeed = 0;
  let speed = minSpeed;
  let isAccelerating = false;

  const gravity = throttle((acc) => {
    if (isAccelerating) {
      if (speed < maxSpeed) {
        speed += 1;
        gravity.decreaseDelay(50);
      }
    } else if (speed > minSpeed) {
      speed -= 1;
      gravity.increaseDelay(50);
    }

    const direction = speed > 0 ? directions.TOP : directions.BOTTOM;
    return moveHelicopter(acc, direction);
  }, 300, 200, 300);

  loop(() => {
    state = pipeline([
      gravity,
      removeOutOfBoundsShapes,
      spawnAndMoveBricks,
    ], state);
    render(state);
  });

  onKeyDown({
    [keyCodes.SPACEBAR]: () => { isAccelerating = true; },
    [keyCodes.RIGHT]: () => spawnAndMoveBricks.decreaseDelay(50),
    [keyCodes.LEFT]: () => spawnAndMoveBricks.increaseDelay(50),
  });

  onKeyUp({
    [keyCodes.SPACEBAR]: () => { isAccelerating = false; },
  });
}
