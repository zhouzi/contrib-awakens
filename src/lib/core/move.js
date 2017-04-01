import pickBy from 'lodash/pickBy';
import omitBy from 'lodash/omitBy';
import keys from 'lodash/keys';
import has from 'lodash/has';
import identity from 'lodash/identity';
import position, { getNewPointsPosition } from './position';

function removeObject(state, id) {
  return omitBy(state, point => point.id === id);
}

function getCollidingObjects(state, currentPoints, [x, y]) {
  const newPoints = getNewPointsPosition(currentPoints, [x, y]);

  return keys(newPoints)
    .map((coords) => {
      if (has(state, coords)) {
        return state[coords];
      }

      return null;
    })
    .filter(identity);
}

export default function move(state, { id }, [incrementX, incrementY], callback = identity) {
  const objectCurrentPointsPosition = pickBy(state, obj => obj.id === id);
  const stateWithoutObject = removeObject(state, id);
  const collidingObjects = getCollidingObjects(
    stateWithoutObject,
    objectCurrentPointsPosition,
    [incrementX, incrementY],
  );

  if (collidingObjects.length) {
    return callback(state, collidingObjects);
  }

  return position(stateWithoutObject, {
    points: objectCurrentPointsPosition,
  }, [incrementX, incrementY]);
}
