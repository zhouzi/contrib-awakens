import reduce from 'lodash/reduce';
import map from 'lodash/map';
import merge from 'lodash/merge';
import keys from 'lodash/keys';
import head from 'lodash/head';
import identity from 'lodash/identity';
import coordKey from './coordKey';
import { getShapeMeta } from './Shape';

function getShapes(state) {
  const shapesMap = reduce(state, (acc, point, coord) => (
    merge({}, acc, {
      [point.id]: {
        [coord]: point,
      },
    })
  ), {});
  return map(shapesMap, identity);
}

function getAxisCoords(shape, axis) {
  const X = 0;
  const Y = 1;
  const index = axis === 'x' ? X : Y;

  return keys(shape)
    .map(key => coordKey.keyToCoord(key)[index])
    .sort();
}

export function filterShapes(fn, name) {
  return (state, shape) => {
    if (getShapeMeta(shape).name === name) {
      return fn(state, shape);
    }

    return state;
  };
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
