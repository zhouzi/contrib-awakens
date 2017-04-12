/* global window */

import toArray from 'lodash/toArray';
import has from 'lodash/has';
import assign from 'lodash/assign';
import reduce from 'lodash/reduce';
import get from 'lodash/get';
import noop from 'lodash/noop';
import { bounds, stringifyCoord } from '../';
import colors from '../colors.json';

function getGraph() {
  return window.document.querySelector('.js-calendar-graph-svg');
}

export function isPlayable() {
  return getGraph() != null;
}

function getCols() {
  return toArray(getGraph().querySelector('g').querySelectorAll('g'));
}

function addMissingCells() {
  const cols = getCols();

  // we must use the first column as an example
  // because the last one may have only one cell (on sundays)
  const firstCol = cols[0];
  const firstCell = firstCol.children[0];
  const firstCellY = Number(firstCell.getAttribute('y'));
  const secondCell = firstCol.children[1];
  const secondCellY = Number(secondCell.getAttribute('y'));
  const yIncrement = secondCellY - firstCellY;
  const length = bounds.y.length;

  cols.forEach((col) => {
    const cells = col.children;

    if (cells.length === length) {
      return;
    }

    const exampleCell = cells[0];
    for (let i = cells.length; i < length; i += 1) {
      const clone = exampleCell.cloneNode();
      clone.setAttribute('y', String(yIncrement * i));
      col.appendChild(clone);
    }
  });
}

function removeUnnecessaryColumns() {
  const cols = getCols();
  const unnecessaryCols = cols.slice(bounds.x.length);
  unnecessaryCols.forEach((col) => {
    col.parentElement.removeChild(col);
  });
}

export const keyCodes = {
  TOP: 38,
  RIGHT: 39,
  BOTTOM: 40,
  LEFT: 37,
  SPACEBAR: 32,
};

let listeners = {};
export function onKeyDown(map) {
  listeners = reduce(map, (acc, listener, keyCode) => (
    assign(acc, {
      [keyCode]: get(acc, keyCode, []).concat(listener),
    })
  ), listeners);
}

let loopCallback = noop;
function createLoop() {
  window.requestAnimationFrame(() => {
    loopCallback();
    createLoop();
  });
}

export function loop(callback) {
  loopCallback = callback;
}

function clear() {
  listeners = {};
  loopCallback = noop;
}

export function setup() {
  addMissingCells();
  removeUnnecessaryColumns();
  createLoop();

  window.document.addEventListener('keydown', (event) => {
    const { keyCode } = event;
    if (has(listeners, keyCode)) {
      event.preventDefault();
      listeners[keyCode].forEach((listener) => {
        listener();
      });
    }
  });
}

let gameOverCallback = noop;
export function onGameOver(fn) {
  gameOverCallback = fn;
}

let lastRenderedState;
export default function render(state) {
  if (lastRenderedState === state) {
    return;
  }

  lastRenderedState = state;

  if (state == null) {
    clear();
    gameOverCallback();
    return;
  }

  const cols = getCols();
  cols.forEach((col, x) => {
    const cells = toArray(col.children);
    cells.forEach((cell, y) => {
      const coord = stringifyCoord([x, y]);
      const color = has(state, coord) ? state[coord].color : colors.EMPTY;
      cell.setAttribute('fill', color);
    });
  });
}
