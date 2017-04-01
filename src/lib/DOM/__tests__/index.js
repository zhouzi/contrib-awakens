const _ = require('lodash');
const test = require('ava');
const jsdom = require('jsdom');
const fixtures = require('./fixtures');
const render = require('../').default;
const getInitialState = require('../../').default;
const position = require('../../position').default;
const { Car } = require('../../__tests__/fixtures');
const colors = require('../../colors.json');

jsdom.env(
  '',
  (err, window) => {
    if (err) {
      throw err;
    }

    global.window = window;

    test.beforeEach(() => fixtures.resetHtml());

    test('should expose a function', (t) => {
      const actual = typeof render;
      const expected = 'function';

      t.is(actual, expected);
    });

    test('should add the missing cells', (t) => {
      render({});

      const actual = fixtures.getCols().every(col => col.children.length === 7);
      const expected = true;

      t.is(actual, expected);
    });

    test('should empty all the cells color', (t) => {
      render({});

      const actual = _.flatMap(fixtures.getCols(), col => (
        _.map(col.children, child => child.getAttribute('fill'))
      )).every(color => color === colors.EMPTY);
      const expected = true;

      t.is(actual, expected);
    });

    test('should paint objects according to their color', (t) => {
      render(position(getInitialState(), Car(), [0, 0]));

      const actual = [
        fixtures.getCellColor([0, 0]),
        fixtures.getCellColor([1, 0]),
      ];
      const expected = [
        'red',
        'red',
      ];

      t.deepEqual(actual, expected);
    });
  },
);
