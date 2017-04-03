const _ = require('lodash');
const test = require('ava');
const getInitialState = require('../').default;
const position = require('../position').default;
const { Car } = require('./fixtures');
const { reduceTop, reduceRight, reduceLeft, reduceBottom } = require('../reduce');
const move = require('../move').default;

function getState(shape = Car()) {
  return position(getInitialState(), shape, [0, 0]);
}

test('should return the state', (t) => {
  const state = getState();
  const actual = reduceLeft(state, _.identity);
  const expected = state;

  t.deepEqual(actual, expected);
});

test('should return callback\'s value', (t) => {
  const state = getState();
  const actual = reduceLeft(state, () => null);
  const expected = null;

  t.is(actual, expected);
});

test('should move a shape', (t) => {
  const state = reduceLeft(
    getState(),
    (nextState, shape) => move(nextState, shape, [1, 0]),
  );
  const actual = [
    state['0.0'],
    state['1.0'].color,
    state['2.0'].color,
  ];
  const expected = [
    undefined,
    'red',
    'red',
  ];

  t.deepEqual(actual, expected);
});

test('should move all the shapes', (t) => {
  const car2 = Car();
  const state = reduceLeft(
    position(getState(), car2, [0, 1]),
    (nextState, shape) => move(nextState, shape, [1, 0]),
  );
  const actual = [
    state['0.0'],
    state['1.0'].color,
    state['2.0'].color,
    state['0.1'],
    state['1.1'].color,
    state['2.1'].color,
  ];
  const expected = [
    undefined,
    'red',
    'red',
    undefined,
    'red',
    'red',
  ];

  t.deepEqual(actual, expected);
});

test('should reduceShapes shape starting from the most left', (t) => {
  const car1 = Car();
  const car2 = Car();
  const state = reduceLeft(
    position(position(getInitialState(), car1, [2, 0]), car2, [0, 0]),
    (nextState, shape) => move(nextState, shape, [-1, 0], () => null),
  );
  const actual = [
    state['-1.0'].color,
    state['0.0'].color,
    state['1.0'].color,
    state['2.0'].color,
  ];
  const expected = [
    'red',
    'red',
    'red',
    'red',
  ];

  t.deepEqual(actual, expected);
});

test('should reduceShapes shape starting from the most right', (t) => {
  const car1 = Car();
  const car2 = Car();
  const car3 = Car();
  const state = reduceRight(
    position(position(position(getInitialState(), car3, [3, 1]), car2, [1, 1]), car1, [0, 0]),
    (nextState, shape) => move(nextState, shape, [1, 0], () => null),
  );
  const actual = [
    state['1.0'].color,
    state['2.0'].color,
    state['2.1'].color,
    state['3.1'].color,
    state['4.1'].color,
    state['5.1'].color,
  ];
  const expected = [
    'red',
    'red',
    'red',
    'red',
    'red',
    'red',
  ];

  t.deepEqual(actual, expected);
});

test('should reduceShapes shape starting from the most top', (t) => {
  const car1 = Car();
  const car2 = Car();
  const car3 = Car();
  const state = reduceTop(
    position(position(position(getInitialState(), car1, [1, 2]), car2, [0, 1]), car3, [1, 0]),
    (nextState, shape) => move(nextState, shape, [0, -1], () => null),
  );
  const actual = [
    state['1.-1'].color,
    state['2.-1'].color,
    state['0.0'].color,
    state['1.0'].color,
    state['1.1'].color,
    state['2.1'].color,
  ];
  const expected = [
    'red',
    'red',
    'red',
    'red',
    'red',
    'red',
  ];

  t.deepEqual(actual, expected);
});

test('should reduceShapes shape starting from the most bottom', (t) => {
  const car1 = Car();
  const car2 = Car();
  const car3 = Car();
  const state = reduceBottom(
    position(position(position(getInitialState(), car1, [0, 0]), car2, [1, 1]), car3, [0, 2]),
    (nextState, shape) => move(nextState, shape, [0, 1], () => null),
  );
  const actual = [
    state['0.1'].color,
    state['1.1'].color,
    state['1.2'].color,
    state['2.2'].color,
    state['0.3'].color,
    state['1.3'].color,
  ];
  const expected = [
    'red',
    'red',
    'red',
    'red',
    'red',
    'red',
  ];

  t.deepEqual(actual, expected);
});
