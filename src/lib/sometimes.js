import random from 'lodash/random';

export default function sometimes(fn, min, max) {
  return (...args) => {
    if (random(min, max) <= min) {
      fn(...args);
    }
  };
}
