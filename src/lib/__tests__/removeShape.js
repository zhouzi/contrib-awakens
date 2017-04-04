const test = require('ava');
const { Car } = require('./fixtures');
const getInitialState = require('../').default;
const position = require('../position').default;
const { getShapeMeta } = require('../Shape');
const removeShape = require('../removeShape').default;

test('should expose a function', (t) => {
  const actual = typeof removeShape;
  const expected = 'function';

  t.is(actual, expected);
});

test('should remove a shape from the state', (t) => {
  const car = Car();
  const actual = removeShape(position(getInitialState(), car, [0, 0]), car);
  const expected = {};

  t.deepEqual(actual, expected);
});

test('should keep non-targeted shapes', (t) => {
  const car1 = Car();
  const car2 = Car();
  const { id, name } = getShapeMeta(car2);
  const state = position(position(getInitialState(), car1, [0, 0]), car2, [0, 1]);
  const actual = removeShape(state, car1);
  const expected = {
    0.1: {
      id,
      name,
      color: 'red',
      meta: {},
    },
    1.1: {
      id,
      name,
      color: 'red',
      meta: {},
    },
  };

  t.deepEqual(actual, expected);
});
