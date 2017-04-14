import random from 'lodash/random';
import head from 'lodash/head';

export default function sometimes(fn, min, max) {
  return (...args) => {
    if (random(min, max) <= min) {
      return fn(...args);
    }
    return head(args);
  };
}
