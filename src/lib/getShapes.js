import reduce from 'lodash/reduce';
import map from 'lodash/map';
import merge from 'lodash/merge';
import identity from 'lodash/identity';
import pickBy from 'lodash/pickBy';

export function getShape(state, id) {
  return pickBy(state, point => point.id === id);
}

export default function getShapes(state) {
  const shapesMap = reduce(state, (acc, point, coord) => (
    merge({}, acc, {
      [point.id]: {
        [coord]: point,
      },
    })
  ), {});
  return map(shapesMap, identity);
}
