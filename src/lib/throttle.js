export default function throttle(fn, delay, min = delay, max = delay) {
  let wait = delay;
  let lastCall = 0;
  let lastReturnValue;

  function throttled(...args) {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      lastReturnValue = fn(...args);
      return lastReturnValue;
    }

    return lastReturnValue;
  }

  throttled.decreaseDelay = (decrease) => {
    wait = Math.max(min, wait - decrease);
  };

  throttled.increaseDelay = (increase) => {
    wait = Math.min(max, wait + increase);
  };

  return throttled;
}
