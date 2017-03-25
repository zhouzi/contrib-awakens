/* global window */

const fs = require('fs');
const path = require('path');

function getHtml() {
  return fs.readFileSync(path.join(__dirname, './graph.html'), 'utf8');
}

function getCell(x, y) {
  const graph = window.document.querySelector('.js-calendar-graph-svg');
  const cols = graph.querySelector('g').querySelectorAll('g');
  return cols[x].children[y];
}

function getCellColor(x, y) {
  return getCell(x, y).getAttribute('fill');
}

module.exports = {
  getHtml,
  getCell,
  getCellColor,
};
