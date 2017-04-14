import _ from 'lodash';
import test from 'ava';
import getInitialState, { position } from '../';
import { Car } from './fixtures';

function positionCar(state = getInitialState(), [x, y] = [0, 0], callback = _.identity) {
  return position(state, Car(), [x, y], callback);
}

test('should position a shape', (t) => {
  const state = positionCar();
  const actual = [
    state['0.0'].color,
    state['1.0'].color,
  ];
  const expected = [
    'red',
    'red',
  ];

  t.deepEqual(actual, expected);
});

test('should position a shape somewhere else', (t) => {
  const state = positionCar(getInitialState(), [2, 0]);
  const actual = [
    state['2.0'].color,
    state['3.0'].color,
  ];
  const expected = [
    'red',
    'red',
  ];

  t.deepEqual(actual, expected);
});

test('should position two cars', (t) => {
  const state = positionCar(positionCar(), [2, 0]);
  const actual = [
    state['0.0'].color,
    state['1.0'].color,
    state['2.0'].color,
    state['3.0'].color,
  ];
  const expected = [
    'red',
    'red',
    'red',
    'red',
  ];

  t.deepEqual(actual, expected);
});

test('should call callback when trying to position a shape over another', (t) => {
  let called;
  positionCar(positionCar(), [0, 0], () => {
    called = true;
  });

  const actual = called;
  const expected = true;

  t.is(actual, expected);
});

test('should call callback with previous state', (t) => {
  let previousState;
  const state = positionCar();
  positionCar(state, [0, 0], (firstArg) => {
    previousState = firstArg;
  });

  const actual = previousState;
  const expected = state;

  t.is(actual, expected);
});

test('should call callback with the colliding points', (t) => {
  let collidingPoints;
  positionCar(positionCar(), [0, 0], (state, secondArg) => {
    collidingPoints = secondArg;
  });

  const actual = [
    collidingPoints[0].name,
    collidingPoints[0].name,
  ];
  const expected = [
    'car',
    'car',
  ];

  t.deepEqual(actual, expected);
});

test('should return the result of callback', (t) => {
  const actual = positionCar(positionCar(), [0, 0], () => 'hello');
  const expected = 'hello';

  t.is(actual, expected);
});
