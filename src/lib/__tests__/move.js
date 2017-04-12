import test from 'ava';
import getInitialState, { position, move } from '../';
import { Car } from './fixtures';

function moveCar(state = getInitialState(), callback) {
  const car = Car();
  return move(
    position(state, car, [0, 0]),
    car,
    [2, 0],
    callback,
  );
}

test('should move a shape to another position', (t) => {
  const state = moveCar();
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

test('should remove the shape from its previous position', (t) => {
  const state = moveCar();
  const actual = [
    state['0.0'],
    state['1.0'],
  ];
  const expected = [
    undefined,
    undefined,
  ];

  t.deepEqual(actual, expected);
});

test('should call callback on collision', (t) => {
  let called;
  const car2 = Car();
  moveCar(position(getInitialState(), car2, [2, 0]), () => {
    called = true;
  });

  const actual = called;
  const expected = true;

  t.is(actual, expected);
});

test('should return state before move on collision', (t) => {
  const car1 = Car();
  const car2 = Car();
  const state = position(
    position(getInitialState(), car1, [0, 0]),
    car2,
    [2, 0],
  );
  const actual = move(state, car1, [2, 0]);
  const expected = state;

  t.is(actual, expected);
});

test('should move a shape relative to its current position', (t) => {
  const car = Car();
  const state = move(position(getInitialState(), car, [2, 0]), car, [2, 0]);
  const actual = [
    state['2.0'],
    state['3.0'],
    state['4.0'].color,
    state['5.0'].color,
  ];
  const expected = [
    undefined,
    undefined,
    'red',
    'red',
  ];

  t.deepEqual(actual, expected);
});
