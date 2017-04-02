/* global window */

import assign from 'lodash/assign';

let listeners = [];

export function clearLoop(callback) {
  if (callback == null) {
    listeners = [];
  } else {
    listeners = listeners.filter(listener => listener.callback !== callback);
  }
}

function loop() {
  if (listeners.length === 0) {
    return;
  }

  window.requestAnimationFrame((timestamp) => {
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
      callback(timestamp - start);
    });

    loop();
  });
}

export default function addCallback(callback) {
  const loopIsActive = listeners.length > 0;

  listeners = listeners.concat({
    start: null,
    callback,
  });

  if (!loopIsActive) {
    loop();
  }
}
