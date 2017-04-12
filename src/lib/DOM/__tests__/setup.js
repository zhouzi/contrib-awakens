import _ from 'lodash';
import test from 'ava';
import jsdom from 'jsdom';
import { resetHtml, getCols } from './fixtures';
import { setup } from '../';

jsdom.env('', (err, window) => {
  if (err) {
    console.log(err);// eslint-disable-line no-console
    return;
  }

  window.requestAnimationFrame = _.noop;// eslint-disable-line no-param-reassign
  global.window = window;

  test.beforeEach(() => {
    resetHtml();
  });

  test('should set cols to all have the same number of cells', (t) => {
    setup();

    const cols = getCols();
    const firstColLength = _.head(cols).children.length;
    const actual = getCols().every(col => col.children.length === firstColLength);
    const expected = true;

    t.is(actual, expected);
  });

  test.todo('should remove unnecessary columns');
});
