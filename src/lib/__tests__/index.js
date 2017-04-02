const test = require('ava');
const jsdom = require('jsdom');
const { Car } = require('../core/__tests__/fixtures');

jsdom.env(
  '',
  (err, window) => {
    if (err) {
      throw err;
    }

    global.window = window;

    const createGame = require('../').default;// eslint-disable-line global-require

    test('should return a different object when state changed', (t) => {
      const car = Car();
      const state = createGame().position(car, [0, 0]);
      const nextState = state.move(car, [1, 0]);

      t.not(state, nextState);
    });

    test('should return the same object when state doesn\'t change', (t) => {
      const car1 = Car();
      const car2 = Car();
      const actual = createGame().position(car1, [0, 0]).position(car2, [2, 0]);
      const expected = actual.move(car1, [1, 0]);

      t.is(actual, expected);
    });
  });
