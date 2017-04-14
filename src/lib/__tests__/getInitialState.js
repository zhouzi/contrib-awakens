import _ from 'lodash';
import test from 'ava';
import getInitialState from '../';

test('should return an object', (t) => {
  const actual = _.isPlainObject(getInitialState());
  const expected = true;

  t.is(actual, expected);
});

test('should return an empty state', (t) => {
  const actual = _.keys(getInitialState()).length;
  const expected = 0;

  t.is(actual, expected);
});
