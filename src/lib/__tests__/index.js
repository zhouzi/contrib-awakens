const test = require('ava');
const jsdom = require('jsdom');
const fixtures = require('./fixtures');

jsdom.env(
  '',
  (err, window) => {
    if (err) {
      throw err;
    }

    global.window = window;

    test.beforeEach(() => fixtures.resetHtml());
  },
);
