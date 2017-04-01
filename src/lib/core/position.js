import assign from 'lodash/assign';
import mapKeys from 'lodash/mapKeys';

export function getShapeNewPosition(shape, [newX, newY]) {
  return mapKeys(shape, (value, key) => {
    const [x, y] = key.split('.').map(Number);
    return `${x + newX}.${y + newY}`;
  });
}

export default function position(state, shape, [newX, newY]) {
  return assign({}, state, getShapeNewPosition(shape, [newX, newY]));
}
