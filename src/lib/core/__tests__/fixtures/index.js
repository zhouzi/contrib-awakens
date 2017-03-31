const Shape = require('../../Shape').default;

function Car() {
  return Shape('car', [
    ['red', 'red'],
  ]);
}

function Ship() {
  return Shape('ship', [
    ['red', 'blue', 'red'],
  ]);
}

module.exports = {
  Car,
  Ship,
};
