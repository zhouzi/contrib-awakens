import keys from 'lodash/keys';
import head from 'lodash/head';
import isString from 'lodash/isString';
import coordKey from './coordKey';
import { getShapeMeta } from './Shape';
import getShapes from './getShapes';

function getAxisCoords(shape, axis) {
  const X = 0;
  const Y = 1;
  const index = axis === 'x' ? X : Y;

  return keys(shape)
    .map(key => coordKey.keyToCoord(key)[index])
    .sort();
}

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
    .sort((a, b) => (
      head(getAxisCoords(a, 'y')) - head(getAxisCoords(b, 'y'))
    ));
  return reduceShapes(state, shapes, iteratee);
}

export function reduceRight(state, iteratee) {
  const shapes = getShapes(state)
    .sort((a, b) => (
      head(getAxisCoords(b, 'x')) - head(getAxisCoords(a, 'x'))
    ));
  return reduceShapes(state, shapes, iteratee);
}

export function reduceBottom(state, iteratee) {
  const shapes = getShapes(state)
    .sort((a, b) => (
      head(getAxisCoords(b, 'y')) - head(getAxisCoords(a, 'y'))
    ));
  return reduceShapes(state, shapes, iteratee);
}

export function reduceLeft(state, iteratee) {
  const shapes = getShapes(state)
    .sort((a, b) => (
      head(getAxisCoords(a, 'x')) - head(getAxisCoords(b, 'x'))
    ));
  return reduceShapes(state, shapes, iteratee);
}
