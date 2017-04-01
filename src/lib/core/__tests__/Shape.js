const test = require('ava');
const { Car, Ship } = require('./fixtures');
const Shape = require('../Shape').default;
const { getShapeMeta } = require('../Shape');

function Plane() {
  return Shape('plane', [
    [null, 'red', null],
    ['red', 'red', 'red'],
    [null, 'red', null],
  ]);
}

test('should expose a function', (t) => {
  const actual = typeof Shape;
  const expected = 'function';

  t.is(actual, expected);
});

test('should create a shape with a name', (t) => {
  const actual = getShapeMeta(Car()).name;
  const expected = 'car';

  t.is(actual, expected);
});

test('should create a shape with a different name', (t) => {
  const actual = getShapeMeta(Ship()).name;
  const expected = 'ship';

  t.is(actual, expected);
});

test('should create a shape with an id', (t) => {
  const actual = typeof getShapeMeta(Car()).id;
  const expected = 'string';

  t.is(actual, expected);
});

test('should generate unique ids', (t) => {
  const actual = getShapeMeta(Car()).id !== getShapeMeta(Car()).id;
  const expected = true;

  t.is(actual, expected);
});

test('should contain a mapping of the points', (t) => {
  const car = Car();
  const { id, name } = getShapeMeta(car);
  const actual = car;
  const expected = {
    '0.0': {
      id,
      name,
      color: 'red',
    },
    '1.0': {
      id,
      name,
      color: 'red',
    },
  };

  t.deepEqual(actual, expected);
});

test('should contain a different mapping', (t) => {
  const ship = Ship();
  const { id, name } = getShapeMeta(ship);
  const actual = ship;
  const expected = {
    '0.0': {
      id,
      name,
      color: 'red',
    },
    '1.0': {
      id,
      name,
      color: 'blue',
    },
    '2.0': {
      id,
      name,
      color: 'red',
    },
  };

  t.deepEqual(actual, expected);
});

test('should ignore null values', (t) => {
  const plane = Plane();
  const { id, name } = getShapeMeta(plane);
  const actual = plane;
  const expected = {
    '1.0': {
      id,
      name,
      color: 'red',
    },
    0.1: {
      id,
      name,
      color: 'red',
    },
    1.1: {
      id,
      name,
      color: 'red',
    },
    1.2: {
      id,
      name,
      color: 'red',
    },
    2.1: {
      id,
      name,
      color: 'red',
    },
  };

  t.deepEqual(actual, expected);
});
