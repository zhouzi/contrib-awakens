import pickBy from 'lodash/pickBy';
import omitBy from 'lodash/omitBy';
import keys from 'lodash/keys';
import has from 'lodash/has';
import identity from 'lodash/identity';
import position, { getNewPosition } from './position';

function removeObject(state, { id }) {
  return omitBy(state, point => point.id === id);
}

function getCollidingObjects(state, object) {
  return keys(object.points)
    .map((coords) => {
      if (has(state, coords)) {
        return state[coords];
      }

      return null;
    })
    .filter(identity);
}

export default function move(state, { id, name }, [incrementX, incrementY], callback = identity) {
  const objectCurrentPosition = {
    id,
    name,
    points: pickBy(state, obj => obj.id === id),
  };
  const objectNewPosition = getNewPosition(objectCurrentPosition, [incrementX, incrementY]);
  const stateWithoutObject = removeObject(state, { id });
  const collidingObjects = getCollidingObjects(stateWithoutObject, objectNewPosition);

  if (collidingObjects.length) {
    return callback(state, collidingObjects);
  }

  return position(stateWithoutObject, objectCurrentPosition, [incrementX, incrementY]);
}
