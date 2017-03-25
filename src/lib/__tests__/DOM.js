const test = require('ava');
const jsdom = require('jsdom');
const _ = require('lodash');
const DOM = require('../DOM').default;
const fixtures = require('./fixtures');

jsdom.env(
  fixtures.getHtml(),
  (err, window) => {
    if (err) {
      throw err;
    }

    global.window = window;

    test('should return a list', (t) => {
      const actual = Object.prototype.toString.call(DOM.readState());
      const expected = '[object Array]';

      t.is(actual, expected);
    });

    test('should return a list of 53 columns', (t) => {
      const actual = DOM.readState().length;
      const expected = 53;

      t.is(actual, expected);
    });

    test('should return columns as being lists', (t) => {
      const actual = DOM.readState().every(col => _.isArray(col));
      const expected = true;

      t.is(actual, expected);
    });

    test('should return columns with 7 cells except for the last one', (t) => {
      const actual = _.initial(DOM.readState()).every(col => col.length === 7);
      const expected = true;

      t.is(actual, expected);
    });

    test('should return a last column with 5 elements', (t) => {
      const actual = _.last(DOM.readState()).length;
      const expected = 5;

      t.is(actual, expected);
    });

    test('should return cells with a background but no foreground', (t) => {
      const actual = DOM.readState().every(col => (
        col.every(cell => cell.background && !cell.foreground)
      ));
      const expected = true;

      t.is(actual, expected);
    });

    test('should return cells with background being their initial color', (t) => {
      // note: testing only a subset here because testing the whole graph would painful
      const actual = DOM.readState().slice(0, 4).map(col => col.map(cell => cell.background));
      const expected = [
        [
          '#c6e48b',
          '#c6e48b',
          '#c6e48b',
          '#c6e48b',
          '#c6e48b',
          '#c6e48b',
          '#196127',
        ],
        [
          '#196127',
          '#7bc96f',
          '#c6e48b',
          '#c6e48b',
          '#c6e48b',
          '#7bc96f',
          '#c6e48b',
        ],
        [
          '#239a3b',
          '#239a3b',
          '#239a3b',
          '#7bc96f',
          '#c6e48b',
          '#7bc96f',
          '#c6e48b',
        ],
        [
          '#c6e48b',
          '#c6e48b',
          '#c6e48b',
          '#c6e48b',
          '#239a3b',
          '#c6e48b',
          '#c6e48b',
        ],
      ];

      t.deepEqual(actual, expected);
    });

    test('should render a cell color', (t) => {
      DOM.render([
        [
          {
            foreground: 'red',
            background: null,
          },
        ],
      ]);

      const actual = fixtures.getCellColor(0, 0);
      const expected = 'red';

      t.is(actual, expected);
    });

    test('should render the cell color with background when foreground is missing', (t) => {
      DOM.render([
        [
          {
            foreground: null,
            background: 'red',
          },
        ],
      ]);

      const actual = fixtures.getCellColor(0, 0);
      const expected = 'red';

      t.is(actual, expected);
    });

    test('should render the cell color foreground in priority', (t) => {
      DOM.render([
        [
          {
            foreground: 'red',
            background: 'yellow',
          },
        ],
      ]);

      const actual = fixtures.getCellColor(0, 0);
      const expected = 'red';

      t.is(actual, expected);
    });

    test('should render several cells color', (t) => {
      DOM.render([
        [
          {
            foreground: 'blue',
            background: null,
          },
          {
            foreground: null,
            background: 'white',
          },
          {
            foreground: 'red',
            background: 'yellow',
          },
        ],
      ]);

      const actual = [
        fixtures.getCellColor(0, 0),
        fixtures.getCellColor(0, 1),
        fixtures.getCellColor(0, 2),
      ];
      const expected = [
        'blue',
        'white',
        'red',
      ];

      t.deepEqual(actual, expected);
    });

    test('should return the state as passed in when calling render', (t) => {
      const state = [
        [
          {
            foreground: 'red',
            background: null,
          },
        ],
      ];
      const actual = DOM.render(state);
      const expected = state;

      t.is(actual, expected);
    });

    test('should read state without losing foreground/background data', (t) => {
      DOM.render([
        [
          {
            foreground: 'red',
            background: 'yellow',
          },
        ],
      ]);

      const actual = DOM.readState()[0][0];
      const expected = {
        foreground: 'red',
        background: 'yellow',
      };

      t.deepEqual(actual, expected);
    });
  },
);
