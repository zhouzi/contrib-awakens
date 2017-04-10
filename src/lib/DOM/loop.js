/* global window */
/* eslint-disable no-param-reassign */

let listeners = [];

(function loop() {
  window.requestAnimationFrame((timestamp) => {
    // the while loop ensure a listener that clears the loop
    // prevent other listeners from being called
    let i = 0;
    while (listeners.length > i) {
      const listener = listeners[i];
      if (listener.startTimestamp == null) {
        listener.startTimestamp = timestamp;
      }

      const currentTimestamp = timestamp - listener.startTimestamp;
      if ((timestamp - listener.lastFrameTimestamp) >= listener.delayBetweenFrames) {
        listener.lastFrameTimestamp = timestamp;
        listener.callback(currentTimestamp);
      }

      i++;
    }

    loop();
  });
}());

export function clearLoop() {
  listeners = [];
}

function updateListener(callback, updater) {
  listeners.forEach((listener) => {
    if (listener.callback === callback) {
      updater(listener);
    }
  });
}

export default function addListener(
  callback,
  delayBetweenFrames = 0,
  minDelayBetweenFrames = 0,
  maxDelayBetweenFrames = Infinity,
) {
  listeners.push({
    startTimestamp: null,
    lastFrameTimestamp: null,
    minDelayBetweenFrames,
    maxDelayBetweenFrames,
    delayBetweenFrames,
    callback,
  });

  return {
    incrementDelay: (delay) => {
      updateListener(callback, (listener) => {
        const newDelay = listener.delayBetweenFrames + delay;
        listener.delayBetweenFrames = Math.min(newDelay, listener.maxDelayBetweenFrames);
      });
    },
    decrementDelay: (delay) => {
      updateListener(callback, (listener) => {
        const newDelay = listener.delayBetweenFrames - delay;
        listener.delayBetweenFrames = Math.max(newDelay, listener.minDelayBetweenFrames);
      });
    },
  };
}
