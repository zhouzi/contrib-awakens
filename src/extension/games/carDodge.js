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
  directions,
  bounds,
} from '../../lib';
import throttle from '../../lib/throttle';
import render, { loop, onKeyDown, keyCodes } from '../../lib/DOM';
import colors from '../../lib/colors.json';

export default function createCarDodge() {
  const car = Shape('car', [
    [colors.LIGHT, colors.LIGHT],
  ]);
  let state = position(getInitialState(), car, [1, bounds.y.middle]);

  function moveCar(direction) {
    const nextState = move(state, car, direction);
    if (isOutOfBounds(nextState, car) === 0) {
      state = nextState;
    }
  }

  function createBrick() {
    const color = sample([
      colors.DARK,
      colors.DARKER,
    ]);
    const size = random(1, 2);
    return Shape('brick', times(size, () => [color]));
  }
  function spawnBrick() {
    const brick = createBrick();
    const x = bounds.x.max;
    const y = random(bounds.y.min, bounds.y.max);
    state = position(state, brick, [x, y]);
  }
  function moveBricks() {
    state = reduceLeft(state, (acc, shape) => {
      if (getShapeName(shape) === 'brick') {
        return move(acc, shape, directions.LEFT, () => null);
      }

      return acc;
    });
    state = removeOutOfBoundsShapes(state);
  }
  const spawnAndMoveBricks = throttle(() => {
    if (random(1, 3) === 1) {
      spawnBrick();
    }

    moveBricks();
  }, 450, 100, 800);

  loop(() => {
    spawnAndMoveBricks();
    render(state);
  });

  onKeyDown({
    [keyCodes.TOP]: moveCar.bind(null, directions.TOP),
    [keyCodes.BOTTOM]: moveCar.bind(null, directions.BOTTOM),
    [keyCodes.RIGHT]: () => spawnAndMoveBricks.decreaseDelay(50),
    [keyCodes.LEFT]: () => spawnAndMoveBricks.increaseDelay(50),
  });
}
