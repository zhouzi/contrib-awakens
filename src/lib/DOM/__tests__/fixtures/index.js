/* global window */

import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.join(__dirname, './graph.html'), 'utf8');

export function resetHtml() {
  window.document.body.innerHTML = html;
}

export function getCols() {
  const graph = window.document.querySelector('.js-calendar-graph-svg');
  return _.toArray(graph.querySelector('g').querySelectorAll('g'));
}

export function getCellColor([x, y]) {
  return getCols()[x].children[y].getAttribute('fill');
}

export default {
  resetHtml,
  getCellColor,
};
