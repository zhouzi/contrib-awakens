const test = require('ava');
const getInitialState = require('../').default;

test('should expose a function', (t) => {
  const actual = typeof getInitialState;
  const expected = 'function';

  t.is(actual, expected);
});

test('should return an empty state', (t) => {
  const actual = getInitialState();
  const expected = {};

  t.deepEqual(actual, expected);
});
