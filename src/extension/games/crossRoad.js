/* global window */

import sample from 'lodash/sample';
import keys from 'lodash/keys';
import head from 'lodash/head';
import flatMap from 'lodash/flatMap';
import range from 'lodash/range';
import log from '../log';
import getInitialState, { bounds, directions } from '../../lib';
import position from '../../lib/position';
import move from '../../lib/move';
import isOutOfBounds from '../../lib/isOutOfBounds';
import { removeOutOfBoundsShape } from '../../lib/removeShape';
import Shape, { getShapeMeta } from '../../lib/Shape';
import { reduceLeft, filterShapes } from '../../lib/reduce';
import getShapes from '../../lib/getShapes';
import coordKey from '../../lib/coordKey';
import render from '../../lib/DOM';
import loop from '../../lib/DOM/loop';
import onKeyDown, { keyCodes } from '../../lib/DOM/keyboard';
import clear from '../../lib/DOM/clear';
import colors from '../../lib/colors.json';

const character = Shape('character', [
  [colors.LOW],
]);

const carsColor = [
  colors.HIGH,
  colors.VERY_HIGH,
];
function createCar() {
  const color = sample(carsColor);
  const speed = sample(['slow', 'fast']);
  const direction = sample(['top', 'bottom']);
  return Shape('car', [
    [color],
    [color],
  ], {
    speed,
    direction,
  });
}

function moveCars(state, speed) {
  return reduceLeft(state, filterShapes(
    (nextState, shape) => {
      const direction = getShapeMeta(shape).meta.direction;
      const coord = directions[direction];
      return move(nextState, shape, coord, () => null);
    },
    (shape) => {
      const { name, meta } = getShapeMeta(shape);
      return name === 'car' && meta.speed === speed;
    },
  ));
}

function getRandomAvailableX(state) {
  const minX = bounds.x.min + 3;
  const maxX = bounds.x.max - 3;
  const cars = getShapes(state).filter(shape => getShapeMeta(shape).name === 'car');
  const takenX = flatMap(cars, car => keys(car).map(coordKey.keyToCoord).map(head));
  const availableX = range(minX, maxX).filter(x => takenX.indexOf(x) === -1);
  return sample(availableX);
}

function spawnCar(state) {
  const car = createCar();
  const { direction } = getShapeMeta(car).meta;
  const x = getRandomAvailableX(state);
  const y = direction === 'top' ? bounds.y.max : bounds.y.min - 1;
  return position(state, car, [x, y]);
}

export default function (onGameOver) {
  log(
    'Press top to move top',
    'Press right to move right',
    'Press bottom to move bottom',
    'Press left to move left',
  );

  let state = position(
    getInitialState(),
    character,
    [bounds.x.min + 1, bounds.y.middle],
  );

  function gameOver() {
    clear();
    onGameOver();
  }

  function moveCharacter(direction) {
    const coord = directions[direction];
    const nextState = move(state, character, coord, () => null);

    if (nextState == null) {
      state = null;
      gameOver();
      return;
    }

    if (isOutOfBounds(nextState, character) === 0) {
      state = nextState;
    }
  }

  loop(() => {
    state = moveCars(state, 'slow');

    if (state == null) {
      gameOver();
      return;
    }

    state = reduceLeft(state, removeOutOfBoundsShape);
  }, 500);

  loop(() => {
    state = moveCars(state, 'fast');

    if (state == null) {
      gameOver();
      return;
    }

    state = reduceLeft(state, removeOutOfBoundsShape);
  }, 250);

  loop(() => {
    state = spawnCar(state);
  }, 250);

  loop(() => render(state));

  onKeyDown({
    [keyCodes.TOP]: () => moveCharacter('top'),
    [keyCodes.RIGHT]: () => moveCharacter('right'),
    [keyCodes.BOTTOM]: () => moveCharacter('bottom'),
    [keyCodes.LEFT]: () => moveCharacter('left'),
  });
}
