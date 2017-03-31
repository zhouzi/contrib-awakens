const _ = require('lodash');
const test = require('ava');
const getInitialState = require('../index').default;
const position = require('../position').default;
const { Car, Ship } = require('./fixtures');
const move = require('../move').default;

function moveObject(object, [incrementX, incrementY]) {
  return move(position(getInitialState(), object, [0, 0]), object, [incrementX, incrementY]);
}

function positionCarAndShip(car, ship, [carX, carY] = [0, 0], [shipX, shipY] = [2, 0]) {
  return position(position(getInitialState(), car, [carX, carY]), ship, [shipX, shipY]);
}

test('should expose a function', (t) => {
  const actual = typeof move;
  const expected = 'function';

  t.is(actual, expected);
});

test('should move an object', (t) => {
  const car = Car();
  const state = moveObject(car, [1, 0]);
  const actual = [
    state['1.0'],
    state['2.0'],
  ];
  const expected = [
    {
      id: car.id,
      name: car.name,
      color: 'red',
    },
    {
      id: car.id,
      name: car.name,
      color: 'red',
    },
  ];

  t.deepEqual(actual, expected);
});

test('should move an object further', (t) => {
  const car = Car();
  const state = moveObject(car, [3, 0]);
  const actual = [
    state['3.0'],
    state['4.0'],
  ];
  const expected = [
    {
      id: car.id,
      name: car.name,
      color: 'red',
    },
    {
      id: car.id,
      name: car.name,
      color: 'red',
    },
  ];

  t.deepEqual(actual, expected);
});

test('should remove the object old points', (t) => {
  const car = Car();
  const state = moveObject(car, [3, 0]);
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

test('should not lose other objects', (t) => {
  const car = Car();
  const ship = Ship();
  const state = move(positionCarAndShip(car, ship, [0, 0], [0, 1]), car, [3, 0]);
  const actual = [
    state['0.1'],
    state['1.1'],
    state['2.1'],
  ];
  const expected = [
    {
      id: ship.id,
      name: ship.name,
      color: 'red',
    },
    {
      id: ship.id,
      name: ship.name,
      color: 'blue',
    },
    {
      id: ship.id,
      name: ship.name,
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
  const state = positionCarAndShip(car, ship);
  let collidingPoints = [];
  move(state, car, [1, 0], (s, collidingPts) => {
    collidingPoints = collidingPts;
  });
  const actual = collidingPoints;
  const expected = [
    {
      id: ship.id,
      name: ship.name,
      color: 'red',
    },
  ];

  t.deepEqual(actual, expected);
});
