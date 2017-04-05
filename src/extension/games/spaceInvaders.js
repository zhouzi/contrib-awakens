import sample from 'lodash/sample';
import random from 'lodash/random';
import uniq from 'lodash/uniq';
import log from '../log';
import getInitialState, { bounds, directions } from '../../lib';
import move from '../../lib/move';
import position from '../../lib/position';
import isOutOfBounds from '../../lib/isOutOfBounds';
import Shape, { getShapeMeta, getShapeBounds } from '../../lib/Shape';
import { getShape } from '../../lib/getShapes';
import { reduceRight, reduceLeft, filterShapes } from '../../lib/reduce';
import removeShape, { removeOutOfBoundsShape } from '../../lib/removeShape';
import colors from '../../lib/colors.json';
import render from '../../lib/DOM';
import loop from '../../lib/DOM/loop';
import onKeyDown, { keyCodes } from '../../lib/DOM/keyboard';
import clear from '../../lib/DOM/clear';

const player = Shape('player', [
  [colors.LOW, null],
  [null, colors.LOW],
  [colors.LOW, null],
]);
function movePlayer(state, coord) {
  const nextState = move(state, player, coord, (prevState, points) => {
    if (points.some(point => point.name === 'ennemy')) {
      return null;
    }

    return prevState;
  });

  if (nextState == null) {
    return null;
  }

  if (isOutOfBounds(nextState, player) === 0) {
    return nextState;
  }

  return state;
}

function createRocket(state) {
  const { id } = getShapeMeta(player);
  const currentPlayer = getShape(state, id);
  const { x2, y2 } = getShapeBounds(currentPlayer);
  const rocket = Shape('rocket', [
    ['#e36209'],
  ]);
  return position(state, rocket, [x2 + 1, y2 - 1]);
}
function onRocketCollision(rocket, state, collidingPoints) {
  const ids = uniq(collidingPoints.map(point => point.id));
  return removeShape(ids.reduce((acc, id) => removeShape(acc, getShape(acc, id)), state), rocket);
}
function moveRockets(state) {
  return reduceRight(state, filterShapes((currentState, rocket) => (
    move(
      currentState,
      rocket,
      directions.right,
      (s, collidignPoints) => onRocketCollision(rocket, s, collidignPoints),
    )
  ), 'rocket'));
}

const ennemiesColors = [
  colors.HIGH,
  colors.VERY_HIGH,
];
function createEnnemy() {
  const color = sample(ennemiesColors);
  return Shape('ennemy', [
    [null, color],
    [color, null],
    [null, color],
  ]);
}
function spawnEnnemy(state) {
  const ennemy = createEnnemy();
  const x = bounds.x.max - 1;
  const y = random(bounds.y.min, bounds.y.max - 2);
  return position(state, ennemy, [x, y]);
}

export default function (onGameOver) {
  log(
    'Press top to move top',
    'Press right to move right',
    'Press bottom to move bottom',
    'Press left to move left',
    'Press space bar to fire',
  );

  let state = position(
    getInitialState(),
    player,
    [bounds.x.min + 1, bounds.y.middle - 1],
  );

  function gameOver() {
    clear();
    onGameOver();
  }

  let lastRocketSpawn = 0;
  onKeyDown({
    [keyCodes.TOP]: () => {
      state = movePlayer(state, directions.top);
      if (state == null) {
        gameOver();
      }
    },
    [keyCodes.RIGHT]: () => {
      state = movePlayer(state, directions.right);
      if (state == null) {
        gameOver();
      }
    },
    [keyCodes.BOTTOM]: () => {
      state = movePlayer(state, directions.bottom);
      if (state == null) {
        gameOver();
      }
    },
    [keyCodes.LEFT]: () => {
      state = movePlayer(state, directions.left);
      if (state == null) {
        gameOver();
      }
    },
    [keyCodes.SPACEBAR]: () => {
      const now = Date.now();
      if (now - lastRocketSpawn >= 1000) {
        state = createRocket(state);
        lastRocketSpawn = now;
      }
    },
  });

  loop(() => {
    state = moveRockets(state);
    state = reduceRight(state, removeOutOfBoundsShape);
  }, 125);

  loop(() => {
    if (random(0, 2) > 0) {
      state = spawnEnnemy(state);
    }
  }, 1000);

  loop(() => {
    state = reduceLeft(state, filterShapes((currentState, ennemy) => (
      move(currentState, ennemy, directions.left, (s, points) => (
        points.some(point => point.name === 'player')
          ? null
          : s
      ))
    ), 'ennemy'));

    if (state == null) {
      gameOver();
      return;
    }

    state = reduceLeft(state, removeOutOfBoundsShape);
  }, 125);

  loop(() => render(state));
}
