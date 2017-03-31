/* global window */

const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, './graph.html'), 'utf8');

function resetHtml() {
  window.document.body.innerHTML = html;
}

function getCols() {
  const graph = window.document.querySelector('.js-calendar-graph-svg');
  return _.toArray(graph.querySelector('g').querySelectorAll('g'));
}

function getCellColor([x, y]) {
  return getCols()[x].children[y].getAttribute('fill');
}

module.exports = {
  resetHtml,
  getCols,
  getCellColor,
};
