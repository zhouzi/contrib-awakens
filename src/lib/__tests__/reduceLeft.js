import test from 'ava';
import getInitialState, { position, getShapeId, move, reduceLeft } from '../';
import { Car } from './fixtures';

function positionCar(car, state = getInitialState(), [x, y] = [0, 0]) {
  return position(state, car, [x, y]);
}

test('should call reducer with the shape', (t) => {
  const shapes = [];
  const car = Car();
  const id = getShapeId(car);
  reduceLeft(positionCar(car), (acc, shape) => {
    shapes.push(getShapeId(shape));
    return acc;
  });

  const actual = shapes;
  const expected = [
    id,
  ];

  t.deepEqual(actual, expected);
});

test('should call reducer for each shapes', (t) => {
  const shapes = [];
  const car1 = Car();
  const car1Id = getShapeId(car1);
  const car2 = Car();
  const car2Id = getShapeId(car2);
  const state = positionCar(car2, positionCar(car1), [2, 0]);
  reduceLeft(state, (acc, shape) => {
    shapes.push(shape);
    return acc;
  });

  const actual = shapes.map(shape => getShapeId(shape));
  const expected = [
    car1Id,
    car2Id,
  ];

  t.deepEqual(actual, expected);
});

test('should return the reduced value', (t) => {
  const car = Car();
  const state = reduceLeft(positionCar(car), (acc, shape) => (
    move(acc, shape, [1, 0])
  ));
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

test('should return early if reducer returns null', (t) => {
  const car1 = Car();
  const car2 = Car();
  const car3 = Car();
  const state = position(
    position(
      position(getInitialState(), car1, [4, 0]),
      car2,
      [2, 0],
    ),
    car3,
    [0, 0],
  );

  const actual = reduceLeft(state, (acc, shape) => (
    move(acc, shape, [1, 0], () => null)
  ));
  const expected = null;

  t.is(actual, expected);
});
