import sample from 'lodash/sample';
import random from 'lodash/random';
import times from 'lodash/times';
import getInitialState, {
  Shape,
  position,
  move,
  isOutOfBounds,
  reduceLeft,
  getShapeName,
  removeOutOfBoundsShapes,
  pipeline,
  sometimes,
  throttle,
  directions,
  bounds,
} from '../../lib';
import render, { loop, onKeyDown, keyCodes } from '../../lib/DOM';
import colors from '../../lib/colors.json';

const car = Shape('car', [
  [colors.LIGHT, colors.LIGHT],
]);

function moveCar(state, direction) {
  const nextState = move(state, car, direction);
  if (isOutOfBounds(nextState, car) === 0) {
    return nextState;
  }

  return state;
}

function createBrick() {
  const color = sample([
    colors.DARK,
    colors.DARKER,
  ]);
  const size = random(1, 2);
  return Shape('brick', times(size, () => [color]));
}

function spawnBrick(state) {
  const brick = createBrick();
  const x = bounds.x.max;
  const y = random(bounds.y.min, bounds.y.max);
  return position(state, brick, [x, y]);
}

function moveBricks(state) {
  return reduceLeft(state, (acc, shape) => {
    if (getShapeName(shape) === 'brick') {
      return move(acc, shape, directions.LEFT, () => null);
    }

    return acc;
  });
}

export default function createCarDodge() {
  let state = position(getInitialState(), car, [1, bounds.y.middle]);

  const spawnBrickSometimes = sometimes(spawnBrick, 1, 2);
  const spawnAndMoveBricks = throttle(() => {
    state = pipeline([
      moveBricks,
      removeOutOfBoundsShapes,
      spawnBrickSometimes,
    ], state);
  }, 450, 100, 800);

  loop(() => {
    spawnAndMoveBricks();
    render(state);
  });

  onKeyDown({
    [keyCodes.TOP]: () => { state = moveCar(state, directions.TOP); },
    [keyCodes.BOTTOM]: () => { state = moveCar(state, directions.BOTTOM); },
    [keyCodes.RIGHT]: () => spawnAndMoveBricks.decreaseDelay(50),
    [keyCodes.LEFT]: () => spawnAndMoveBricks.increaseDelay(50),
  });
}
