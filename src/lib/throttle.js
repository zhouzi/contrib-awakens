import head from 'lodash/head';

export default function throttle(fn, delay, min = delay, max = delay) {
  let wait = delay;
  let lastCall = 0;

  function throttled(...args) {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      return fn(...args);
    }

    return head(args);
  }

  throttled.decreaseDelay = (decrease) => {
    wait = Math.max(min, wait - decrease);
  };

  throttled.increaseDelay = (increase) => {
    wait = Math.min(max, wait + increase);
  };

  return throttled;
}
