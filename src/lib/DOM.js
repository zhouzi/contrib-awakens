/* global window */

import toArray from 'lodash/toArray';

function getDOMGrid() {
  const graph = window.document.querySelector('.js-calendar-graph-svg');
  return toArray(graph.querySelector('g').querySelectorAll('g')).map(col => toArray(col.children));
}

function readState() {
  return getDOMGrid().map(cells => cells.map((cell) => {
    const foreground = cell.getAttribute('data-foreground');
    const background = cell.getAttribute('data-background') || cell.getAttribute('fill');

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
      cell.setAttribute('fill', foreground || background);
    });
  });

  return state;
}

export default {
  readState,
  render,
};
