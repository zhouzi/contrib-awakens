/* global window */

import toArray from 'lodash/toArray';

function getDOMGrid() {
  const graph = window.document.querySelector('.js-calendar-graph-svg');
  return toArray(graph.querySelector('g').querySelectorAll('g')).map(col => toArray(col.children));
}

function readState() {
  return getDOMGrid().map(cells => cells.map(cell => ({
    foreground: null,
    background: cell.getAttribute('fill'),
  })));
}

function render(state) {
  const DOMGrid = getDOMGrid();

  state.forEach((col, x) => {
    col.forEach((cell, y) => {
      const color = cell.foreground || cell.background;
      DOMGrid[x][y].setAttribute('fill', color);
    });
  });

  return state;
}

export default {
  readState,
  render,
};
