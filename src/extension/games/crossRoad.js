/* global window */

import sample from 'lodash/sample';
import random from 'lodash/random';
import keys from 'lodash/keys';
import log from '../log';
import createGame, { Shape, bounds, loop, keyCodes, onKeyDown, render } from '../../lib';
import colors from '../../lib/colors.json';

export default function (onGameOver) {
  log(
    'Press top to move top',
    'Press right to move right',
    'Press bottom to move bottom',
    'Press left to move left',
  );

  let state = createGame();

  const character = Shape('character', [
    [colors.LOW],
  ]);
  state = state.position(character, [bounds.x.min + 1, bounds.y.middle]);

  const carsColor = [
    colors.HIGH,
    colors.VERY_HIGH,
  ];
  function createCar() {
    const color = sample(carsColor);
    return Shape('car', [
      [color],
      [color],
    ]);
  }

  const carsGroups = {
    slow: [],
    fast: [],
  };
  function moveCars(group) {
    const cars = carsGroups[group];
    for (let i = 0; i < cars.length; i += 1) {
      const { direction, shape } = cars[i];

      state = state.move(shape, [0, direction === 'top' ? -1 : 1], (s, collidingPoints) => {
        if (collidingPoints.some(({ name }) => name === 'character')) {
          return null;
        }

        return s;
      });

      if (state == null) {
        onGameOver();
        return;
      }
    }

    carsGroups[group] = carsGroups[group].filter((car) => {
      const shouldRemove = state.isOutOfBounds(car.shape) === 1;
      if (shouldRemove) {
        state = state.removeShape(car.shape);
        return false;
      }

      return true;
    });
  }

  function isFreeX(x) {
    return keys(carsGroups).every(group => carsGroups[group].every(car => car.x !== x));
  }

  function getRandomAvailableX() {
    const minX = bounds.x.min + 3;
    const maxX = bounds.x.max - 3;
    const availableX = [];

    for (let x = minX; x <= maxX; x += 1) {
      if (isFreeX(x)) {
        availableX.push(x);
      }
    }

    return sample(availableX);
  }

  function spawnCar() {
    const shape = createCar();
    const direction = random(0, 1) === 1 ? 'top' : 'bottom';
    const group = sample(keys(carsGroups));
    const x = getRandomAvailableX();
    const y = direction === 'top' ? bounds.y.max : bounds.y.min - 1;

    carsGroups[group].push({
      shape,
      direction,
      x,
    });

    state = state.position(shape, [x, y]);
  }

  function safeCall(fn) {
    return () => {
      if (state == null) {
        return;
      }

      fn();
    };
  }

  loop(safeCall(() => moveCars('slow')), 500);
  loop(safeCall(() => moveCars('fast')), 200);
  loop(safeCall(() => spawnCar()), 250);
  loop(() => render(state));

  function moveCharacter(direction) {
    let coord;

    if (direction === 'top') {
      coord = [0, -1];
    } else if (direction === 'right') {
      coord = [1, 0];
    } else if (direction === 'bottom') {
      coord = [0, 1];
    } else {
      coord = [-1, 0];
    }

    const nextState = state.move(character, coord, () => null);

    if (nextState == null) {
      onGameOver();
    } else if (nextState.isOutOfBounds(character) === 0) {
      state = nextState;
    }
  }

  onKeyDown(keyCodes.TOP, () => moveCharacter('top'));
  onKeyDown(keyCodes.RIGHT, () => moveCharacter('right'));
  onKeyDown(keyCodes.BOTTOM, () => moveCharacter('bottom'));
  onKeyDown(keyCodes.LEFT, () => moveCharacter('left'));
}
