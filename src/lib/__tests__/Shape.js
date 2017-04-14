import _ from 'lodash';
import test from 'ava';
import { Car, Ship } from './fixtures';

test('should return an object', (t) => {
  const actual = _.isPlainObject(Car());
  const expected = true;

  t.is(actual, expected);
});

test('should return a shape with two points', (t) => {
  const actual = _.keys(Car()).length;
  const expected = 2;

  t.is(actual, expected);
});

test('should return points with the right position', (t) => {
  const car = Car();
  const actual = [
    car['0.0'].color,
    car['1.0'].color,
  ];
  const expected = [
    'red',
    'red',
  ];

  t.deepEqual(actual, expected);
});

test('should return a different shape', (t) => {
  const ship = Ship();
  const actual = [
    ship['0.0'].color,
    ship['1.1'].color,
    ship['0.2'].color,
  ];
  const expected = [
    'green',
    'blue',
    'green',
  ];

  t.deepEqual(actual, expected);
});

test('should return a shape with a different name', (t) => {
  const ship = Ship();
  const actual = [
    ship['0.0'].name,
    ship['1.1'].name,
    ship['0.2'].name,
  ];
  const expected = [
    'ship',
    'ship',
    'ship',
  ];

  t.deepEqual(actual, expected);
});

test('should return points with a reference to the shape name', (t) => {
  const car = Car();
  const actual = [
    car['0.0'].name,
    car['1.0'].name,
  ];
  const expected = [
    'car',
    'car',
  ];

  t.deepEqual(actual, expected);
});

test('should return points with a reference to the shape id', (t) => {
  const car = Car();
  const actual = [
    typeof car['0.0'].id,
    typeof car['1.0'].id,
  ];
  const expected = [
    'string',
    'string',
  ];

  t.deepEqual(actual, expected);
});

test('should return a shape with each of its points being the same id', (t) => {
  const car = Car();
  const actual = car['0.0'].id;
  const expected = car['1.0'].id;

  t.is(actual, expected);
});

test('should generate unique ids', (t) => {
  const car1 = Car();
  const car2 = Car();
  const actual = car1['0.0'].id !== car2['0.0'].id;
  const expected = true;

  t.is(actual, expected);
});

test('should reference a meta object', (t) => {
  const actual = _.isPlainObject(Car()['0.0'].meta);
  const expected = true;

  t.is(actual, expected);
});

test('should have an empty meta by default', (t) => {
  const actual = _.keys(Car()['0.0'].meta).length;
  const expected = 0;

  t.is(actual, expected);
});

test('should set meta as provided', (t) => {
  const actual = Car({ foo: 'bar' })['0.0'].meta;
  const expected = {
    foo: 'bar',
  };

  t.deepEqual(actual, expected);
});
