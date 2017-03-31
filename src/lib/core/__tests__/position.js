const test = require('ava');
const { Car, Ship } = require('./fixtures');
const getInitialState = require('../index').default;
const position = require('../position').default;

test('should expose a function', (t) => {
  const actual = typeof position;
  const expected = 'function';

  t.is(actual, expected);
});

test('should position an object', (t) => {
  const car = Car();
  const actual = position(getInitialState(), car, [0, 0]);
  const expected = {
    '0.0': {
      id: car.id,
      name: car.name,
      color: 'red',
    },
    '1.0': {
      id: car.id,
      name: car.name,
      color: 'red',
    },
  };

  t.deepEqual(actual, expected);
});

test('should position a different object', (t) => {
  const ship = Ship();
  const actual = position(getInitialState(), ship, [0, 0]);
  const expected = {
    '0.0': {
      id: ship.id,
      name: ship.name,
      color: 'red',
    },
    '1.0': {
      id: ship.id,
      name: ship.name,
      color: 'blue',
    },
    '2.0': {
      id: ship.id,
      name: ship.name,
      color: 'red',
    },
  };

  t.deepEqual(actual, expected);
});

test('should position an object at a different position', (t) => {
  const car = Car();
  const actual = position(getInitialState(), car, [2, 1]);
  const expected = {
    2.1: {
      id: car.id,
      name: car.name,
      color: 'red',
    },
    3.1: {
      id: car.id,
      name: car.name,
      color: 'red',
    },
  };

  t.deepEqual(actual, expected);
});

test('should position several objects', (t) => {
  const car = Car();
  const ship = Ship();
  const actual = position(position(getInitialState(), car, [0, 0]), ship, [0, 1]);
  const expected = {
    '0.0': {
      id: car.id,
      name: car.name,
      color: 'red',
    },
    '1.0': {
      id: car.id,
      name: car.name,
      color: 'red',
    },
    0.1: {
      id: ship.id,
      name: ship.name,
      color: 'red',
    },
    1.1: {
      id: ship.id,
      name: ship.name,
      color: 'blue',
    },
    2.1: {
      id: ship.id,
      name: ship.name,
      color: 'red',
    },
  };

  t.deepEqual(actual, expected);
});
