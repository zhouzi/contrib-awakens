import pickBy from 'lodash/pickBy';
import keys from 'lodash/keys';
import { bounds } from './';
import { getShapeMeta } from './Shape';
import coordKey from './coordKey';

export default function isOutOfBounds(state, shape) {
  const { id, length } = getShapeMeta(shape);
  const outOfBoundsPoints = pickBy(state, (point, coord) => {
    if (point.id === id) {
      const [x, y] = coordKey.keyToCoord(coord);
      return x < bounds.x.min || x > bounds.x.max || y < bounds.y.min || y > bounds.y.max;
    }

    return false;
  });
  const nbOutOfBoundsPoints = keys(outOfBoundsPoints).length;
  return Number((nbOutOfBoundsPoints / length).toFixed(1));
}
