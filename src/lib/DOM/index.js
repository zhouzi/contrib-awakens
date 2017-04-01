/* global window */

import toArray from 'lodash/toArray';
import forEach from 'lodash/forEach';
import has from 'lodash/has';
import colors from '../colors.json';

function getCols() {
  const graph = window.document.querySelector('.js-calendar-graph-svg');
  return toArray(graph.querySelector('g').querySelectorAll('g'));
}

function addMissingCells() {
  const cols = getCols();
  const length = cols[0].children.length;

  cols
    .forEach((col) => {
      const cells = col.children;

      if (cells.length === length) {
        return;
      }

      const firstCellY = Number(cells[0].getAttribute('y'));
      const secondCellY = Number(cells[1].getAttribute('y'));
      const yIncrement = secondCellY - firstCellY;
      const exampleCell = cells[0];

      for (let i = cells.length; i < length; i += 1) {
        const clone = exampleCell.cloneNode();
        clone.setAttribute('y', String(yIncrement * i));
        col.appendChild(clone);
      }
    });
}

export const keyCodes = {
  LEFT: 37,
  TOP: 38,
  RIGHT: 39,
  BOTTOM: 40,
};

// Note: could use requestAnimationFrame but I am not
//       convinced its pros would outwheight its complexity
//       since the animations are not meant to be smooth
export function loop(callback, delay) {
  (function next() {
    callback();
    setTimeout(next, delay);
  })();
}

export default function render(state) {
  addMissingCells();

  const cols = getCols().map(col => toArray(col.children));
  forEach(cols, (cells, x) => {
    cells.forEach((cell, y) => {
      const key = `${x}.${y}`;
      const color = has(state, key) ? state[key].color : colors.EMPTY;
      cell.setAttribute('fill', color);
    });
  });
}
