import omitBy from 'lodash/omitBy';
import { getShapeMeta } from './Shape';

export default function removeShape(state, shape) {
  const { id } = getShapeMeta(shape);
  return omitBy(state, point => point.id === id);
}
