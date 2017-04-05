import isString from 'lodash/isString';
import { getShapeMeta, getShapeBounds } from './Shape';
import getShapes from './getShapes';

export function filterShapes(fn, filter) {
  const filterFn =
    isString(filter)
      ? shape => getShapeMeta(shape).name === filter
      : filter;
  return (state, shape) => (
    filterFn(shape)
      ? fn(state, shape)
      : state
  );
}

export default function reduceShapes(state, shapes, iteratee) {
  let nextState = state;
  for (let i = 0; i < shapes.length; i += 1) {
    const shape = shapes[i];
    nextState = iteratee(nextState, shape);

    if (nextState == null) {
      return nextState;
    }
  }

  return nextState;
}

export function reduceTop(state, iteratee) {
  const shapes = getShapes(state)
    .sort((a, b) => getShapeBounds(a).y1 - getShapeBounds(b).y1);
  return reduceShapes(state, shapes, iteratee);
}

export function reduceRight(state, iteratee) {
  const shapes = getShapes(state)
    .sort((a, b) => getShapeBounds(b).x1 - getShapeBounds(a).x1);
  return reduceShapes(state, shapes, iteratee);
}

export function reduceBottom(state, iteratee) {
  const shapes = getShapes(state)
    .sort((a, b) => getShapeBounds(b).y1 - getShapeBounds(a).y1);
  return reduceShapes(state, shapes, iteratee);
}

export function reduceLeft(state, iteratee) {
  const shapes = getShapes(state)
    .sort((a, b) => getShapeBounds(a).x1 - getShapeBounds(b).x1);
  return reduceShapes(state, shapes, iteratee);
}
