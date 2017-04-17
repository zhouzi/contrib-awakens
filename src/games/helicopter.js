import sample from 'lodash/sample';
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
import render, { loop, onKeyDown, keyCodes } from '../lib/DOM';
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
      const topBrickHeight = sample([0, 0, 1, 1, 2]);

      if (topBrickHeight === 0) {
        return acc;
      }

      const topBrick = createBrick(topBrickHeight, colors.DARK);
      return position(acc, topBrick, [bounds.x.max, bounds.y.min], () => null);
    },
    (acc) => {
      const bottomBrickHeight = sample([1, 1, 2, 2, 2, 4]);
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

  let velocity = 0;
  const rise = throttle(acc => moveHelicopter(acc, directions.TOP), 150);
  const fall = throttle((acc) => {
    if (velocity > 0) {
      velocity = 0;
      return acc;
    }

    return moveHelicopter(acc, directions.BOTTOM);
  }, 500);

  loop(() => {
    state = pipeline([
      fall,
      removeOutOfBoundsShapes,
      spawnAndMoveBricks,
    ], state);
    render(state);
  });

  onKeyDown({
    [keyCodes.SPACEBAR]: () => {
      velocity = 1;
      state = rise(state);
    },
    [keyCodes.RIGHT]: () => spawnAndMoveBricks.decreaseDelay(50),
    [keyCodes.LEFT]: () => spawnAndMoveBricks.increaseDelay(50),
  });
}

createHelicopter.controls = {
  spacebar: 'move up',
  right: 'accelerate',
  left: 'decelerate',
};
