import random from 'lodash/random';
import sample from 'lodash/sample';
import getInitialState, {
  Shape,
  position,
  move,
  isOutOfBounds,
  getShape,
  getShapeBounds,
  getShapeName,
  reduceRight,
  reduceLeft,
  pipeline,
  removeBy,
  remove,
  bounds,
  directions,
} from '../../lib';
import throttle from '../../lib/throttle';
import render, { loop, onKeyDown, keyCodes } from '../../lib/DOM';
import colors from '../../lib/colors.json';

const player = Shape('player', [
  [colors.LIGHT, null],
  [null, colors.LIGHT],
  [colors.LIGHT, null],
]);

function movePlayer(state, direction) {
  const nextState = move(state, player, direction, () => null);

  if (nextState == null) {
    return null;
  }

  if (isOutOfBounds(nextState, player) === 0) {
    return nextState;
  }

  return state;
}

function spawnRocket(state) {
  const shapeInState = getShape(state, player);
  const { x2, y2 } = getShapeBounds(shapeInState);
  const rocket = Shape('rocket', [
    ['#e34c26'],
  ]);
  return position(state, rocket, [x2 + 1, y2 - 1]);
}

function onRocketCollision(rocket, state, collidingPoints) {
  const ids = collidingPoints
    .filter(point => point.name === 'ennemy')
    .map(point => point.id);

  if (ids.length) {
    return removeBy(
      remove(state, rocket),
      point => ids.indexOf(point.id) > -1,
    );
  }

  return state;
}

function moveRockets(state) {
  return reduceRight(state, (acc, shape) => {
    if (getShapeName(shape) === 'rocket') {
      return move(acc, shape, directions.RIGHT, onRocketCollision.bind(null, shape));
    }

    return acc;
  });
}

function spawnEnnemy(state) {
  const color = sample([
    colors.DARK,
    colors.DARKER,
  ]);
  const ennemy = Shape('ennemy', [
    [null, color],
    [color, null],
    [null, color],
  ]);
  return position(state, ennemy, [
    bounds.x.max,
    random(0, bounds.y.max - 2),
  ]);
}

function moveEnnemies(state) {
  return reduceLeft(state, (acc, shape) => {
    if (getShapeName(shape) === 'ennemy') {
      return move(
        acc,
        shape,
        directions.LEFT,
        (s, collidingPoints) => (
          collidingPoints.some(({ name }) => name === 'player')
            ? null
            : s
        ),
      );
    }

    return acc;
  });
}

export default function createSpaceInvaders() {
  let state = position(getInitialState(), player, [
    bounds.x.min + 1,
    bounds.y.middle - 1,
  ]);

  const moveRocketsAndEnnemies = throttle(acc => pipeline([
    moveRockets,
    moveEnnemies,
  ], acc), 150);
  const throttledSpawnEnnemy = throttle(spawnEnnemy, 1000);
  loop(() => {
    state = pipeline([
      moveRocketsAndEnnemies,
      throttledSpawnEnnemy,
    ], state);
    render(state);
  });

  const throttledSpawnRocket = throttle(spawnRocket, 800);
  onKeyDown({
    [keyCodes.TOP]: () => { state = movePlayer(state, directions.TOP); },
    [keyCodes.RIGHT]: () => { state = movePlayer(state, directions.RIGHT); },
    [keyCodes.BOTTOM]: () => { state = movePlayer(state, directions.BOTTOM); },
    [keyCodes.LEFT]: () => { state = movePlayer(state, directions.LEFT); },
    [keyCodes.SPACEBAR]: () => { state = throttledSpawnRocket(state); },
  });
}
