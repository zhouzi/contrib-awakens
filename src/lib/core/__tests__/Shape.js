const test = require('ava');
const { Car, Ship } = require('./fixtures');
const Shape = require('../Shape').default;

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

test('should create an object with a name', (t) => {
  const actual = Car().name;
  const expected = 'car';

  t.is(actual, expected);
});

test('should create an object with a different name', (t) => {
  const actual = Ship().name;
  const expected = 'ship';

  t.is(actual, expected);
});

test('should create an object with an id', (t) => {
  const actual = typeof Car().id;
  const expected = 'string';

  t.is(actual, expected);
});

test('should generate unique ids', (t) => {
  const actual = Car().id !== Car().id;
  const expected = true;

  t.is(actual, expected);
});

test('should contain a mapping of the points', (t) => {
  const { id, name, points } = Car();
  const actual = points;
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
  const { id, name, points } = Ship();
  const actual = points;
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
  const { id, name, points } = Plane();
  const actual = points;
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
