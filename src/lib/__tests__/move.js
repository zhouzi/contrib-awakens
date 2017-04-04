const _ = require('lodash');
const test = require('ava');
const getInitialState = require('../index').default;
const position = require('../position').default;
const { getShapeMeta } = require('../Shape');
const { Car, Ship } = require('./fixtures');
const move = require('../move').default;

function moveShape(shape, [incrementX, incrementY]) {
  return move(position(getInitialState(), shape, [0, 0]), shape, [incrementX, incrementY]);
}

function positionCarAndShip(car, ship, [carX, carY] = [0, 0], [shipX, shipY] = [2, 0]) {
  return position(position(getInitialState(), car, [carX, carY]), ship, [shipX, shipY]);
}

test('should expose a function', (t) => {
  const actual = typeof move;
  const expected = 'function';

  t.is(actual, expected);
});

test('should move a shape', (t) => {
  const car = Car();
  const { id, name } = getShapeMeta(car);
  const state = moveShape(car, [1, 0]);
  const actual = [
    state['1.0'],
    state['2.0'],
  ];
  const expected = [
    {
      id,
      name,
      color: 'red',
    },
    {
      id,
      name,
      color: 'red',
    },
  ];

  t.deepEqual(actual, expected);
});

test('should throw an error when trying to move an object that\'s not on the grid', (t) => {
  const car = Car();
  const state = getInitialState();
  t.throws(() => move(state, car, [0, 0]));
});

test('should move a shape further', (t) => {
  const car = Car();
  const { id, name } = getShapeMeta(car);
  const state = moveShape(car, [3, 0]);
  const actual = [
    state['3.0'],
    state['4.0'],
  ];
  const expected = [
    {
      id,
      name,
      color: 'red',
    },
    {
      id,
      name,
      color: 'red',
    },
  ];

  t.deepEqual(actual, expected);
});

test('should remove the shape old points', (t) => {
  const car = Car();
  const state = moveShape(car, [3, 0]);
  const actual = [
    state['0.0'],
    state['1.0'],
    state['2.0'],
  ];
  const expected = [
    undefined,
    undefined,
    undefined,
  ];

  t.deepEqual(actual, expected);
});

test('should not lose other shapes', (t) => {
  const car = Car();
  const ship = Ship();
  const { id, name } = getShapeMeta(ship);
  const state = move(positionCarAndShip(car, ship, [0, 0], [0, 1]), car, [3, 0]);
  const actual = [
    state['0.1'],
    state['1.1'],
    state['2.1'],
  ];
  const expected = [
    {
      id,
      name,
      color: 'red',
    },
    {
      id,
      name,
      color: 'blue',
    },
    {
      id,
      name,
      color: 'red',
    },
  ];

  t.deepEqual(actual, expected);
});

test('should not move an object if it would collide with an other object', (t) => {
  const car = Car();
  const ship = Ship();
  const state = positionCarAndShip(car, ship);
  const actual = move(state, car, [1, 0], _.identity);
  const expected = state;

  t.is(actual, expected);
});

test('should call a function when the object is about to collide', (t) => {
  const car = Car();
  const ship = Ship();
  const state = positionCarAndShip(car, ship);
  let called = false;
  move(state, car, [1, 0], () => {
    called = true;
  });
  const actual = called;
  const expected = true;

  t.is(actual, expected);
});

test('should provide the colliding points', (t) => {
  const car = Car();
  const ship = Ship();
  const { id, name } = getShapeMeta(ship);
  const state = positionCarAndShip(car, ship);
  let collidingPoints = [];
  move(state, car, [1, 0], (s, collidingPts) => {
    collidingPoints = collidingPts;
  });
  const actual = collidingPoints;
  const expected = [
    {
      id,
      name,
      color: 'red',
    },
  ];

  t.deepEqual(actual, expected);
});

test.todo('move(state, car, [0, 0]) should === state');
test.todo('move(state, car, [0, 0]) should === move(move(state, car, [0, 0]), car, [0, 0])');
