import uniqueId from 'lodash/uniqueId';
import assign from 'lodash/assign';

function addPoint(state, x, y, { id, name, color }) {
  return assign(state, {
    [`${x}.${y}`]: {
      id,
      name,
      color,
    },
  });
}

function addPoints(id, name, y) {
  return (state, color, x) => {
    if (color == null) {
      return state;
    }

    return addPoint(state, x, y, {
      id,
      name,
      color,
    });
  };
}

export default function Shape(name, shape) {
  const id = uniqueId(`${name}-`);
  const points = shape.reduce((acc, cells, y) => (
    cells.reduce(addPoints(id, name, y), acc)
  ), {});

  return {
    id,
    name,
    points,
  };
}
