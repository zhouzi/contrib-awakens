import keys from 'lodash/keys';
import head from 'lodash/head';
import range from 'lodash/range';
import sample from 'lodash/sample';
import getInitialState, {
  Shape,
  position,
  move,
  isOutOfBounds,
  getShapes,
  getShapeName,
  getShapeMeta,
  parseCoord,
  reduceTop,
  reduceBottom,
  removeOutOfBoundsShapes,
  pipeline,
  bounds,
  directions,
} from '../../lib';
import throttle from '../../lib/throttle';
import render, { loop, onKeyDown, keyCodes } from '../../lib/DOM';
import colors from '../../lib/colors.json';

const character = Shape('character', [
  [colors.LIGHT],
]);

function moveCharacter(state, direction) {
  const nextState = move(state, character, direction, () => null);
  if (nextState == null) {
    return null;
  }

  if (isOutOfBounds(nextState, character) === 0) {
    return nextState;
  }

  return state;
}

function getRandomEmptyX(state) {
  const nonEmptyX = getShapes(state)
    .filter(shape => getShapeName(shape) === 'car')
    .map(shape => keys(shape).map(coord => head(parseCoord(coord))))
    .reduce((acc, x) => acc.concat(x), []);
  const min = bounds.x.min + 3;
  const max = bounds.x.max - 3;
  const emptyX = range(min, max).filter(x => nonEmptyX.indexOf(x) === -1);
  return sample(emptyX);
}

function moveCarsReducer(dir) {
  return (acc, shape) => {
    const name = getShapeName(shape);
    const { direction } = getShapeMeta(shape);
    if (name === 'car' && direction === dir) {
      return move(acc, shape, directions[dir], () => null);
    }

    return acc;
  };
}

function moveCarsWithSpeed(speed) {
  return state => pipeline([
    acc => reduceTop(acc, moveCarsReducer('BOTTOM', speed)),
    acc => reduceBottom(acc, moveCarsReducer('TOP', speed)),
  ], state);
}

function spawnCar(state) {
  const x = getRandomEmptyX(state);
  const direction = sample(['TOP', 'BOTTOM']);
  const y = direction === 'BOTTOM' ? bounds.y.min - 1 : bounds.y.max;
  const color = sample([colors.DARK, colors.DARKER]);
  const speed = sample(['slow', 'fast']);
  const car = Shape('car', [
    [color],
    [color],
  ], { direction, speed });
  return position(state, car, [x, y]);
}

export default function createCrossRoad() {
  let state = position(getInitialState(), character, [bounds.x.min + 1, bounds.y.middle]);

  const moveSlowCars = throttle(moveCarsWithSpeed('slow'), 500);
  const moveFastCars = throttle(moveCarsWithSpeed('fast'), 250);
  const throttledSpawnCar = throttle(spawnCar, 500);
  loop(() => {
    state = pipeline([
      moveSlowCars,
      moveFastCars,
      removeOutOfBoundsShapes,
      throttledSpawnCar,
    ], state);
    render(state);
  });

  onKeyDown({
    [keyCodes.TOP]: () => { state = moveCharacter(state, directions.TOP); },
    [keyCodes.RIGHT]: () => { state = moveCharacter(state, directions.RIGHT); },
    [keyCodes.BOTTOM]: () => { state = moveCharacter(state, directions.BOTTOM); },
    [keyCodes.LEFT]: () => { state = moveCharacter(state, directions.LEFT); },
  });
}
