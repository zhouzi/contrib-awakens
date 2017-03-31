import assign from 'lodash/assign';
import mapKeys from 'lodash/mapKeys';

export function getNewPosition(object, [newX, newY]) {
  return assign({}, object, {
    points: mapKeys(object.points, (value, key) => {
      const [x, y] = key.split('.').map(Number);
      return `${x + newX}.${y + newY}`;
    }),
  });
}

export default function position(state, car, [newX, newY]) {
  return assign({}, state, getNewPosition(car, [newX, newY]).points);
}
