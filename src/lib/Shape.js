import uniqueId from 'lodash/uniqueId';
import assign from 'lodash/assign';
import head from 'lodash/head';
import keys from 'lodash/keys';
import isString from 'lodash/isString';
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
