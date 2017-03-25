const _ = require('lodash');
const test = require('ava');
const jsdom = require('jsdom');
const getState = require('../').default;
const fixtures = require('./fixtures');

jsdom.env(
  fixtures.getHtml(),
  (err, window) => {
    if (err) {
      throw err;
    }

    global.window = window;

    test('should return an updateCell function', (t) => {
      const actual = typeof getState().updateCell;
      const expected = 'function';

      t.is(actual, expected);
    });

    test('should update a cell', (t) => {
      const x = 0;
      const y = 0;
      const color = 'red';

      getState().updateCell(x, y, {
        foreground: color,
      });

      const actual = fixtures.getCellColor(x, y);
      const expected = color;

      t.is(actual, expected);
    });

    test('should update a cell with a different color', (t) => {
      const x = 0;
      const y = 0;
      const color = 'yellow';

      getState().updateCell(x, y, {
        foreground: color,
      });

      const actual = fixtures.getCellColor(x, y);
      const expected = color;

      t.is(actual, expected);
    });

    test('should return the api when calling a method', (t) => {
      const actual = _.keys(getState().updateCell(0, 0, {
        foreground: 'red',
      }));
      const expected = _.keys(getState());

      t.deepEqual(actual, expected);
    });
  },
);
