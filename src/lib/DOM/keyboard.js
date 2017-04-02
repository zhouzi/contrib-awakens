/* global window */

import get from 'lodash/get';
import omitBy from 'lodash/omitBy';

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
};

export function removeKeyDownListener(keyCode, callback) {
  if (keyCode == null) {
    listeners = {};
  } else if (callback == null) {
    listeners[keyCode] = [];
  } else {
    listeners[keyCode] = omitBy(listeners[keyCode], cb => cb === callback);
  }
}

export default function addKeyDownListener(keyCode, callback) {
  if (listeners[keyCode] == null) {
    listeners[keyCode] = [];
  }

  listeners[keyCode].push(callback);
}
