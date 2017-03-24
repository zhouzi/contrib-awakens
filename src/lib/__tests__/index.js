const fs = require('fs');
const path = require('path');
const test = require('ava');
const jsdom = require('jsdom');
const getState = require('../').default;

jsdom.env(
  fs.readFileSync(path.join(__dirname, './graph.html'), 'utf8'),
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
  },
);
