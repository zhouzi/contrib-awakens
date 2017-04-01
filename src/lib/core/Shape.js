import uniqueId from 'lodash/uniqueId';
import assign from 'lodash/assign';

function getNonEmptyCells(cells) {
  return cells
    .map((color, x) => ({ color, x }))
    .filter(({ color }) => color != null);
}

export default function Shape(name, shape) {
  const id = uniqueId(`${name}-`);
  const points = shape
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

  return {
    id,
    name,
    points,
  };
}
