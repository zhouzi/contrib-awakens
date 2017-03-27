/* global window */

import toArray from 'lodash/toArray';
import colors from './colors.json';

function getCols() {
  const graph = window.document.querySelector('.js-calendar-graph-svg');
  return toArray(graph.querySelector('g').querySelectorAll('g'));
}

function getDOMGrid() {
  return getCols().map(col => toArray(col.children));
}

function createClone(cell) {
  const clone = cell.cloneNode();
  clone.setAttribute('fill', colors.EMPTY);
  return clone;
}

function addMissingDOMCells() {
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

      for (let i = cells.length; i < length; i++) {
        const clone = createClone(exampleCell);
        clone.setAttribute('y', String(yIncrement * i));
        col.appendChild(clone);
      }
    });
}

function readState() {
  addMissingDOMCells();

  return getDOMGrid().map(cells => cells.map((cell) => {
    const foreground = cell.getAttribute('data-foreground') || cell.getAttribute('fill');
    const background = cell.getAttribute('data-background');

    return {
      foreground,
      background,
    };
  }));
}

function render(state) {
  const DOMGrid = getDOMGrid();

  state.forEach((col, x) => {
    col.forEach(({ foreground, background }, y) => {
      const cell = DOMGrid[x][y];
      cell.setAttribute('data-foreground', foreground);
      cell.setAttribute('data-background', background);

      const color = foreground || background || colors.EMPTY;
      cell.setAttribute('fill', color);
    });
  });

  return state;
}

export default {
  readState,
  render,
};
