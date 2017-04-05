import uniqueId from 'lodash/uniqueId';
import assign from 'lodash/assign';
import head from 'lodash/head';
import keys from 'lodash/keys';
import isString from 'lodash/isString';
import last from 'lodash/last';
import coordKey from './coordKey';

function getNonEmptyCells(cells) {
  return cells
    .map((color, x) => ({ color, x }))
    .filter(({ color }) => color != null);
}

export function getShapeMeta(shape) {
  const coords = keys(shape);
  const firstCoord = head(coords);
  const { id, name, meta } = shape[firstCoord];
  const length = coords.length;
  return {
    id,
    name,
    length,
    meta,
  };
}

export function getShapeAxisCoords(shape, axis) {
  const X = 0;
  const Y = 1;
  const index = axis === 'x' ? X : Y;

  return keys(shape)
    .map(key => coordKey.keyToCoord(key)[index])
    .sort();
}

export function getShapeBounds(shape) {
  const xs = getShapeAxisCoords(shape, 'x');
  const x1 = head(xs);
  const x2 = last(xs);

  const ys = getShapeAxisCoords(shape, 'y');
  const y1 = head(ys);
  const y2 = last(ys);

  return {
    x1,
    x2,
    y1,
    y2,
  };
}

export default function Shape(name, shape, meta = {}) {
  if (!isString(name)) {
    throw new Error('Shape expects first argument to be a name (string)');
  }

  const id = uniqueId(`${name}-`);
  const mappedShape = shape
    .map((cells, y) => (
      getNonEmptyCells(cells)
        .reduce((acc, { color, x }) => assign(acc, {
          [coordKey.coordToKey([x, y])]: {
            id,
            name,
            color,
            meta,
          },
        }), {})
    ))
    .reduce((acc, cells) => assign(acc, cells), {});

  if (keys(mappedShape).length === 0) {
    throw new Error('Shape cannot create an object without any cells');
  }

  return mappedShape;
}
