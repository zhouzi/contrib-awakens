/* global window */

import get from 'lodash/get';
import forEach from 'lodash/forEach';

let listeners = {};

window.document.addEventListener('keydown', (event) => {
  const callbacks = get(listeners, event.keyCode, []);
  if (callbacks.length) {
    event.preventDefault();
    callbacks.forEach((callback) => {
      callback();
    });
  }
});

export const keyCodes = {
  LEFT: 37,
  TOP: 38,
  RIGHT: 39,
  BOTTOM: 40,
  SPACEBAR: 32,
};

export function clearKeyDownListeners() {
  listeners = {};
}

export default function addKeyDownListener(callbacks) {
  forEach(callbacks, (callback, keyCode) => {
    if (listeners[keyCode] == null) {
      listeners[keyCode] = [];
    }

    listeners[keyCode].push(callback);
  });
}
