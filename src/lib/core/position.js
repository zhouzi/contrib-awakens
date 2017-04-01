import assign from 'lodash/assign';
import mapKeys from 'lodash/mapKeys';

export function getNewPointsPosition(points, [newX, newY]) {
  return mapKeys(points, (value, key) => {
    const [x, y] = key.split('.').map(Number);
    return `${x + newX}.${y + newY}`;
  });
}

export default function position(state, { points }, [newX, newY]) {
  return assign({}, state, getNewPointsPosition(points, [newX, newY]));
}
