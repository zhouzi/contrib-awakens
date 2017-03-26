/* global window */

const fs = require('fs');
const path = require('path');

function getHtml() {
  return fs.readFileSync(path.join(__dirname, './graph.html'), 'utf8');
}

function getGraph() {
  return window.document.querySelector('.js-calendar-graph-svg');
}

function getCell([x, y]) {
  const cols = getGraph().querySelector('g').querySelectorAll('g');
  return cols[x].children[y];
}

function getCellColor([x, y]) {
  return getCell([x, y]).getAttribute('fill');
}

function resetHtml() {
  window.document.body.innerHTML = getHtml();
}

module.exports = {
  getCell,
  getCellColor,
  resetHtml,
};
