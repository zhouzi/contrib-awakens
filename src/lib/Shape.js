import uniqueId from 'lodash/uniqueId';
import assign from 'lodash/assign';
import head from 'lodash/head';
import keys from 'lodash/keys';
import isString from 'lodash/isString';

function getNonEmptyCells(cells) {
  return cells
    .map((color, x) => ({ color, x }))
    .filter(({ color }) => color != null);
}

export function getShapeMeta(shape) {
  const coords = keys(shape);
  const firstCoord = head(coords);
  const { id, name } = shape[firstCoord];
  const length = coords.length;
  return {
    id,
    name,
    length,
  };
}

export default function Shape(name, shape) {
  if (!isString(name)) {
    throw new Error('Shape expects first argument to be a name (string)');
  }

  const id = uniqueId(`${name}-`);
  const mappedShape = shape
    .map((cells, y) => (
      getNonEmptyCells(cells)
        .reduce((acc, { color, x }) => assign(acc, {
          [`${x}.${y}`]: {
            id,
            name,
            color,
          },
        }), {})
    ))
    .reduce((acc, cells) => assign(acc, cells), {});

  if (keys(mappedShape).length === 0) {
    throw new Error('Shape cannot create an object without any cells');
  }

  return mappedShape;
}
