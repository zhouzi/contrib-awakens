import reduce from 'lodash/reduce';
import map from 'lodash/map';
import merge from 'lodash/merge';
import identity from 'lodash/identity';

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
