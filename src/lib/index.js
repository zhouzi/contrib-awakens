import Immutable from 'seamless-immutable';
import mapValues from 'lodash/mapValues';
import times from 'lodash/times';
import flatten from 'lodash/flatten';
import isFunction from 'lodash/isFunction';
import DOM from './DOM';

function range(min, max) {
  return times((max - min) + 1, i => min + i);
}

function coordsRange([x1, x2], [y1, y2]) {
  return flatten(range(x1, x2).map(x => range(y1, y2).map(y => [x, y])));
}

function reduceRange(state, [x1, x2], [y1, y2], fn) {
  return coordsRange([x1, x2], [y1, y2]).reduce(fn, state);
}

export function reduce(state, fn) {
  return reduceRange(state, [0, state.length - 1], [0, state[0].length - 1], fn);
}

export function updateCell(state, [x, y], props) {
  const update = isFunction(props) ? props : obj => obj.merge(props);
  return state.update(x, col => col.set(y, update(col[y], x, y)));
}

export function updateCells(state, [x1, x2], [y1, y2], props) {
  return reduceRange(state, [x1, x2], [y1, y2], (acc, [x, y]) => updateCell(acc, [x, y], props));
}

export function moveCell(state, [fromX, fromY], [toX, toY]) {
  if (state[toX][toY].foreground) {
    return state;
  }

  return updateCell(updateCell(state, [toX, toY], {
    foreground: state[fromX][fromY].foreground,
  }), [fromX, fromY], {
    foreground: null,
  });
}

function bindMethodsToState(methods, state) {
  return mapValues(methods, method => (...args) => (
    fromState(method(state, ...args))// eslint-disable-line no-use-before-define
  ));
}

function fromState(state) {
  return bindMethodsToState({
    render: DOM.render,
    updateCell,
    updateCells,
    moveCell,
    reduce,
  }, state);
}

function getState() {
  const state = new Immutable(DOM.readState());
  return fromState(state);
}

export default getState;
