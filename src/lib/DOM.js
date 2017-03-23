/* global window */

import toArray from 'lodash/toArray';

function readState() {
  const graph = window.document.querySelector('.js-calendar-graph-svg');
  const cols = toArray(graph.querySelector('g').querySelectorAll('g')).map(col => toArray(col.children));
  return cols.map(cells => cells.map(cell => ({
    foreground: null,
    background: cell.getAttribute('fill'),
  })));
}

export default {
  readState,
};
