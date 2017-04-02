const test = require('ava');
const { Car, Ship } = require('./fixtures');
const getInitialState = require('../index').default;
const { getShapeMeta } = require('../Shape');
const position = require('../position').default;

test('should expose a function', (t) => {
  const actual = typeof position;
  const expected = 'function';

  t.is(actual, expected);
});

test('should position a shape', (t) => {
  const car = Car();
  const { id, name } = getShapeMeta(car);
  const actual = position(getInitialState(), car, [0, 0]);
  const expected = {
    '0.0': {
      id,
      name,
      color: 'red',
    },
    '1.0': {
      id,
      name,
      color: 'red',
    },
  };

  t.deepEqual(actual, expected);
});

test('should position a different shape', (t) => {
  const ship = Ship();
  const { id, name } = getShapeMeta(ship);
  const actual = position(getInitialState(), ship, [0, 0]);
  const expected = {
    '0.0': {
      id,
      name,
      color: 'red',
    },
    '1.0': {
      id,
      name,
      color: 'blue',
    },
    '2.0': {
      id,
      name,
      color: 'red',
    },
  };

  t.deepEqual(actual, expected);
});

test('should position a shape at a different position', (t) => {
  const car = Car();
  const { id, name } = getShapeMeta(car);
  const actual = position(getInitialState(), car, [2, 1]);
  const expected = {
    2.1: {
      id,
      name,
      color: 'red',
    },
    3.1: {
      id,
      name,
      color: 'red',
    },
  };

  t.deepEqual(actual, expected);
});

test('should position several shapes', (t) => {
  const car = Car();
  const { id: carId, name: carName } = getShapeMeta(car);
  const ship = Ship();
  const { id: shipId, name: shipName } = getShapeMeta(ship);
  const actual = position(position(getInitialState(), car, [0, 0]), ship, [0, 1]);
  const expected = {
    '0.0': {
      id: carId,
      name: carName,
      color: 'red',
    },
    '1.0': {
      id: carId,
      name: carName,
      color: 'red',
    },
    0.1: {
      id: shipId,
      name: shipName,
      color: 'red',
    },
    1.1: {
      id: shipId,
      name: shipName,
      color: 'blue',
    },
    2.1: {
      id: shipId,
      name: shipName,
      color: 'red',
    },
  };

  t.deepEqual(actual, expected);
});

test.todo('position(position(state, car, [0, 0]), car, [0, 0]) should === state');
