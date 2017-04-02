const test = require('ava');
const { Car, Ship } = require('./fixtures');
const { default: getInitialState, bounds } = require('../');
const position = require('../position').default;
const isOutOfBounds = require('../isOutOfBounds').default;

function positionShape(shape, [x, y] = [0, 0]) {
  return position(getInitialState(), shape, [x, y]);
}

test('should expose a function', (t) => {
  const actual = typeof isOutOfBounds;
  const expected = 'function';

  t.is(actual, expected);
});

test('should return an int', (t) => {
  const car = Car();
  const state = positionShape(car);
  const actual = typeof isOutOfBounds(state, car);
  const expected = 'number';

  t.is(actual, expected);
});

test('should return 0 if the shape is not out of bounds', (t) => {
  const car = Car();
  const state = positionShape(car);
  const actual = isOutOfBounds(state, car);
  const expected = 0;

  t.is(actual, expected);
});

test('should return 0.5 if half of the shape is out of bounds', (t) => {
  const car = Car();
  const state = positionShape(car, [-1, 0]);
  const actual = isOutOfBounds(state, car);
  const expected = 0.5;

  t.is(actual, expected);
});

test('should return 1 if the whole shape is out of bounds', (t) => {
  const car = Car();
  const state = positionShape(car, [-2, 0]);
  const actual = isOutOfBounds(state, car);
  const expected = 1;

  t.is(actual, expected);
});

test('should work for too large x too', (t) => {
  const car = Car();
  const state = positionShape(car, [bounds.x.max + 1, 0]);
  const actual = isOutOfBounds(state, car);
  const expected = 1;

  t.is(actual, expected);
});

test('should work with different shapes', (t) => {
  const ship = Ship();
  const state = positionShape(ship, [-1, 0]);
  const actual = isOutOfBounds(state, ship);
  const expected = 0.3;

  t.is(actual, expected);
});
