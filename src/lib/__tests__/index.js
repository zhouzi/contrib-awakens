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

      getState().updateCell([x, y], {
        foreground: color,
      }).render();

      const actual = fixtures.getCellColor([x, y]);
      const expected = color;

      t.is(actual, expected);
    });

    test('should update a cell with a different color', (t) => {
      const x = 0;
      const y = 0;
      const color = 'yellow';

      getState().updateCell([x, y], {
        foreground: color,
      }).render();

      const actual = fixtures.getCellColor([x, y]);
      const expected = color;

      t.is(actual, expected);
    });

    test('should return the api when calling a method', (t) => {
      const actual = _.keys(getState().updateCell([0, 0], {
        foreground: 'red',
      }));
      const expected = _.keys(getState());

      t.deepEqual(actual, expected);
    });

    test('should move a cell to another position', (t) => {
      getState()
        .updateCell([0, 0], {
          foreground: 'red',
        })
        .moveCell([0, 0], [0, 1])
        .render();

      const actual = fixtures.getCellColor([0, 1]);
      const expected = 'red';

      t.is(actual, expected);
    });

    test('should restore the cell background when it has moved', (t) => {
      const originalColor = fixtures.getCellColor([0, 0]);

      getState()
        .updateCell([0, 0], {
          foreground: 'red',
        })
        .moveCell([0, 0], [0, 1])
        .render();

      const actual = fixtures.getCellColor([0, 0]);
      const expected = originalColor;

      t.is(actual, expected);
    });

    test('should update a range of cells', (t) => {
      getState().updateCells([0, 0], [0, 6], {
        foreground: 'red',
      }).render();

      const actual = [
        fixtures.getCellColor([0, 0]),
        fixtures.getCellColor([0, 1]),
        fixtures.getCellColor([0, 2]),
        fixtures.getCellColor([0, 3]),
        fixtures.getCellColor([0, 4]),
        fixtures.getCellColor([0, 5]),
        fixtures.getCellColor([0, 6]),
      ];
      const expected = [
        'red',
        'red',
        'red',
        'red',
        'red',
        'red',
        'red',
      ];

      t.deepEqual(actual, expected);
    });

    test('should accept a function as updater', (t) => {
      getState().updateCell([2, 6], (cell, x, y) => cell.merge({
        foreground: `${x}-${y}`,
      })).render();

      const actual = fixtures.getCellColor([2, 6]);
      const expected = '2-6';

      t.is(actual, expected);
    });
  },
);
