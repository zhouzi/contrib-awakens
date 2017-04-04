/* global window */

import toArray from 'lodash/toArray';
import forEach from 'lodash/forEach';
import has from 'lodash/has';
import { bounds } from '../';
import colors from '../colors.json';

function getGraph() {
  return window.document.querySelector('.js-calendar-graph-svg');
}

export function hasGraph() {
  return getGraph() != null;
}

function getCols() {
  return toArray(getGraph().querySelector('g').querySelectorAll('g'));
}

function removeUnnecessaryCells() {
  const cols = getCols();
  const unnecessaryCols = cols.slice(bounds.x.length);
  unnecessaryCols.forEach(col => col.parentElement.removeChild(col));
}

function addMissingCells() {
  const cols = getCols();

  // we must use the first column as an example
  // because the last one may have only one cell (on sundays)
  const firstCellY = Number(cols[0].children[0].getAttribute('y'));
  const secondCellY = Number(cols[0].children[1].getAttribute('y'));
  const yIncrement = secondCellY - firstCellY;

  cols
    .forEach((col) => {
      const cells = col.children;

      if (cells.length === bounds.y.length) {
        return;
      }

      const exampleCell = cells[0];

      for (let i = cells.length; i < bounds.y.length; i += 1) {
        const clone = exampleCell.cloneNode();
        clone.setAttribute('y', String(yIncrement * i));
        col.appendChild(clone);
      }
    });
}

let lastRenderedState = null;
export default function render(state) {
  if (state === lastRenderedState) {
    return;
  }

  lastRenderedState = state;

  removeUnnecessaryCells();
  addMissingCells();

  if (state == null) {
    return;
  }

  const cols = getCols().map(col => toArray(col.children));
  forEach(cols, (cells, x) => {
    cells.forEach((cell, y) => {
      const key = `${x}.${y}`;
      const color = has(state, key) ? state[key].color : colors.EMPTY;
      cell.setAttribute('fill', color);
    });
  });
}
