function keyToCoord(key) {
  return key.split('.').map(Number);
}

function coordToKey([x, y]) {
  return `${x}.${y}`;
}

export default {
  keyToCoord,
  coordToKey,
};
