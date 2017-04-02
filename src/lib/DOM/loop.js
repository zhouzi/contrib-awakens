/* global window */

import assign from 'lodash/assign';

let loopStart = null;
let timerId = null;
let listeners = [];

export function off(callback) {
  if (callback == null) {
    window.cancelAnimationFrame(timerId);

    loopStart = null;
    timerId = null;
    listeners = [];
  } else {
    listeners = listeners.filter(listener => listener.callback !== callback);
  }
}

function loop() {
  timerId = window.requestAnimationFrame(function step(timestamp) {
    if (loopStart == null) {
      loopStart = timestamp;
    }

    listeners = listeners
      .map((listener) => {
        if (listener.start == null) {
          return assign({}, listener, {
            start: timestamp,
          });
        }

        return listener;
      });

    listeners.forEach(({ start, callback }) => {
      callback(timestamp - start, timestamp - loopStart, timestamp);
    });

    loop();
  });
}

export default function addCallback(callback) {
  listeners.push({
    start: null,
    callback,
  });

  if (timerId == null) {
    loop();
  }
}
