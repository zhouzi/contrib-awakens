import omitBy from 'lodash/omitBy';
import { getShapeMeta } from './Shape';
import isOutOfBounds from './isOutOfBounds';

export default function removeShape(state, shape) {
  const { id } = getShapeMeta(shape);
  return omitBy(state, point => point.id === id);
}

export function removeOutOfBoundsShape(state, shape) {
  return isOutOfBounds(state, shape) === 1 ? removeShape(state, shape) : state;
}
