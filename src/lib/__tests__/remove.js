import _ from 'lodash';
import test from 'ava';
import getInitialState, { position, remove } from '../';
import { Car } from './fixtures';

test('should remove a shape from state', (t) => {
  const car = Car();
  const actual = remove(position(getInitialState(), car, [0, 0]), car);
  const expected = {};

  t.deepEqual(actual, expected);
});

test('should keep other shapes', (t) => {
  const car1 = Car();
  const car2 = Car();
  const actual = _.keys(remove(position(
    position(getInitialState(), car1, [2, 0]),
    car2,
    [4, 0],
  ), car1));
  const expected = [
    '4.0',
    '5.0',
  ];

  t.deepEqual(actual, expected);
});
