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
  bounds,
  directions,
} from '../../lib';
import throttle from '../../lib/throttle';
import render, { loop, onKeyDown, onKeyUp, keyCodes } from '../../lib/DOM';
import colors from '../../lib/colors.json';

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

function createBrick(height) {
  return Shape('brick', times(height, () => [colors.DARKER]));
}

function spawnBrick(state) {
  const minHeight = 1;

  const topMaxHeight = 4;
  const topBrickHeight = random(minHeight, topMaxHeight);

  const bottomMaxHeight = Math.max(minHeight, bounds.y.middle - topBrickHeight);
  const bottomBrickHeight = random(minHeight, bottomMaxHeight);
  return pipeline([
    (acc) => {
      const topBrick = createBrick(topBrickHeight);
      return position(acc, topBrick, [bounds.x.max, bounds.y.min], () => null);
    },
    (acc) => {
      const bottomBrick = createBrick(bottomBrickHeight);
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

  let inertia = -1;
  const makeHelicopterFall = throttle((acc) => {
    if (inertia > -1) {
      inertia -= 1;
      return acc;
    }
    return moveHelicopter(acc, directions.BOTTOM);
  }, 500);
  const spawnAndMoveBricks = throttle(acc => pipeline([
    moveBricks,
    spawnBrick,
  ], acc), 400, 100, 800);

  loop(() => {
    state = pipeline([
      makeHelicopterFall,
      removeOutOfBoundsShapes,
      spawnAndMoveBricks,
    ], state);
    render(state);
  });

  onKeyDown({
    [keyCodes.SPACEBAR]: () => {
      inertia = 1;
      state = moveHelicopter(state, directions.TOP);
    },
    [keyCodes.RIGHT]: () => spawnAndMoveBricks.decreaseDelay(50),
    [keyCodes.LEFT]: () => spawnAndMoveBricks.increaseDelay(50),
  });

  onKeyUp({
    [keyCodes.SPACEBAR]: () => {
      inertia = 0;
    },
  });
}
