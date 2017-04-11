import test from 'ava';
import getInitialState, { position, isOutOfBounds } from '../';
import { Car, Boat } from './fixtures';

function positionCar(car, [x, y] = [0, 0]) {
  return position(getInitialState(), car, [x, y]);
}

test('should return 0 when the shape is within bounds', (t) => {
  const car = Car();
  const actual = isOutOfBounds(positionCar(car), car);
  const expected = 0;

  t.is(actual, expected);
});

test('should return 1 when the shape is out of bounds', (t) => {
  const car = Car();
  const actual = isOutOfBounds(positionCar(car, [-2, 0]), car);
  const expected = 1;

  t.is(actual, expected);
});

test('should return 0.5 when the shape is partially out of bounds', (t) => {
  const car = Car();
  const actual = isOutOfBounds(positionCar(car, [-1, 0]), car);
  const expected = 0.5;

  t.is(actual, expected);
});

test('should return 0.3 when 1/3 of the shape is out of bounds', (t) => {
  const boat = Boat();
  const actual = isOutOfBounds(position(getInitialState(), boat, [-1, 0]), boat);
  const expected = 0.3;

  t.is(actual, expected);
});
