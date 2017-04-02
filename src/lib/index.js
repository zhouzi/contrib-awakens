import mapValues from 'lodash/mapValues';
import assign from 'lodash/assign';

import DOMRender from './DOM';
import { clearLoop } from './DOM/loop';
import { removeKeyDownListener } from './DOM/keyboard';
import getInitialState from './core';
import position from './core/position';
import move from './core/move';
import removeShape from './core/removeShape';
import isOutOfBounds from './core/isOutOfBounds';

export { bounds } from './core';
export { default as Shape } from './core/Shape';
export { default as loop, createLooper } from './DOM/loop';
export { default as onKeyDown, keyCodes } from './DOM/keyboard';

function clear() {
  clearLoop();
  removeKeyDownListener();
}

const privateGetterName = '__superPrivateStateGetter__';
function bindMethodsToState(state) {
  const api = assign({}, mapValues({
    position,
    move,
    removeShape,
  }, fn => (...args) => {
    const nextState = fn(state, ...args);
    if (nextState === state) {
      return api;
    }

    if (nextState == null) {
      clear();
      return null;
    }

    return bindMethodsToState(nextState);
  }), {
    isOutOfBounds: shape => isOutOfBounds(state, shape),
    [privateGetterName]: () => state,
  });

  return api;
}

export function render(api) {
  const state = api == null ? null : api[privateGetterName]();
  DOMRender(state);
}

export default function createGame() {
  clear();
  return bindMethodsToState(getInitialState());
}
