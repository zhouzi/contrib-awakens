import get from 'lodash/get';
import keys from 'lodash/keys';
import identity from 'lodash/identity';
import { getShapeNewPosition } from './position';

export default function getFutureCollidingPoints(state, currentShape, [futureX, futureY]) {
  const futureShape = getShapeNewPosition(currentShape, [futureX, futureY]);
  return keys(futureShape)
    .map(coords => get(state, coords))
    .filter(identity);
}
