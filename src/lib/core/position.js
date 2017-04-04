import assign from 'lodash/assign';
import mapKeys from 'lodash/mapKeys';
import coordKey from './coordKey';
import getFutureCollidingPoints from './getFutureCollidingPoints';

export function getShapeNewPosition(shape, [newX, newY]) {
  return mapKeys(shape, (value, key) => {
    const [x, y] = coordKey.keyToCoord(key);
    return coordKey.coordToKey([x + newX, y + newY]);
  });
}

export default function position(state, shape, [newX, newY]) {
  const collidingPoints = getFutureCollidingPoints(state, shape, [newX, newY]);

  if (collidingPoints.length) {
    throw new Error('position cannot position a shape over an other');
  }

  return assign({}, state, getShapeNewPosition(shape, [newX, newY]));
}
