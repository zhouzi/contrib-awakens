import assign from 'lodash/assign';
import mapKeys from 'lodash/mapKeys';
import coordKey from './coordKey';

export function getShapeNewPosition(shape, [newX, newY]) {
  return mapKeys(shape, (value, key) => {
    const [x, y] = coordKey.keyToCoord(key);
    return coordKey.coordToKey([x + newX, y + newY]);
  });
}

export default function position(state, shape, [newX, newY]) {
  return assign({}, state, getShapeNewPosition(shape, [newX, newY]));
}
