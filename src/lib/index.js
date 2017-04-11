import Immutable from 'seamless-immutable';
import uniqueId from 'lodash/uniqueId';
import keys from 'lodash/keys';
import identity from 'lodash/identity';
import head from 'lodash/head';
import values from 'lodash/values';
import inRange from 'lodash/inRange';
import pickBy from 'lodash/pickBy';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import last from 'lodash/last';

export function Shape(name, schema, meta = {}) {
  const id = uniqueId(`${name}-`);
  return schema
    .map((row, y) => ({ row, y }))
    .map(({ row, y }) => row.reduce((acc, color, x) => acc.concat({
      x,
      y,
      color,
    }), []))
    .reduce((acc, row) => acc.concat(row), [])
    .filter(cell => cell.color)
    .reduce((acc, { x, y, color }) => acc.merge({
      [`${x}.${y}`]: {
        id,
        name,
        color,
        meta,
      },
    }), new Immutable({}));
}

function parseCoord(coord) {
  return coord.split('.').map(Number);
}

export function stringifyCoord([x, y]) {
  return `${x}.${y}`;
}

function moveShapePointsOrigin(shape, [x, y]) {
  return keys(shape).reduce((acc, coord) => {
    const [currentX, currentY] = parseCoord(coord);
    const newX = currentX + x;
    const newY = currentY + y;

    return acc.set(stringifyCoord([newX, newY]), shape[coord]);
  }, new Immutable({}));
}

function getCollidingPoints(state, shape) {
  return keys(shape)
    .map(coord => state[coord])
    .filter(identity);
}

export function position(state, shape, [x, y], callback = identity) {
  const shapeWithNewPosition = moveShapePointsOrigin(shape, [x, y]);
  const collidingPoints = getCollidingPoints(state, shapeWithNewPosition);

  if (collidingPoints.length === 0) {
    return keys(shapeWithNewPosition).reduce((acc, coord) => (
      acc.set(coord, shapeWithNewPosition[coord])
    ), state);
  }

  return callback(state, collidingPoints);
}

export function getShapeId(shape) {
  return head(values(shape)).id;
}

export function remove(state, shape) {
  const id = getShapeId(shape);
  return keys(state).reduce((acc, coord) => {
    const point = state[coord];
    if (point.id === id) {
      return acc.without(coord);
    }

    return acc;
  }, state);
}

function getShape(state, shape) {
  const id = getShapeId(shape);
  return new Immutable(pickBy(state, point => point.id === id));
}

export const bounds = {
  x1: 0,
  x2: 52,
  y1: 0,
  y2: 6,
};

export function isOutOfBounds(state, shape) {
  const shapeInState = getShape(state, shape);
  const coords = keys(shapeInState);
  const total = coords.length;
  const outOfBounds = coords.filter((coord) => {
    const [x, y] = parseCoord(coord);
    return !inRange(x, bounds.x1, bounds.x2) || !inRange(y, bounds.y1, bounds.y2);
  }).length;
  return Number((outOfBounds / total).toFixed(1));
}

function getShapes(state) {
  const shapesMap = reduce(state, (acc, point, coord) => (
    acc.merge({
      [point.id]: {
        [coord]: point,
      },
    }, { deep: true })
  ), new Immutable({}));
  return map(shapesMap, identity);
}

function getShapeBounds(shape) {
  const coords = keys(shape).map(parseCoord);
  const xs = coords.map(head).sort();
  const ys = coords.map(last).sort();
  return {
    x1: head(xs),
    x2: last(xs),
    y1: head(ys),
    y2: last(ys),
  };
}

function getSortedShapes(state, comparator) {
  return getShapes(state).sort((a, b) => {
    const aBounds = getShapeBounds(a);
    const bBounds = getShapeBounds(b);
    return comparator(aBounds, bBounds);
  });
}

function reduceShapes(state, shapes, reducer) {
  let nextState = state;
  for (let i = 0; i < shapes.length; i += 1) {
    const shape = shapes[i];
    nextState = reducer(nextState, shape);
    if (nextState == null) {
      return null;
    }
  }

  return nextState;
}

export function reduceTop(state, reducer) {
  const shapes = getSortedShapes(state, (aBounds, bBounds) => (
    aBounds.y1 - bBounds.y1
  ));
  return reduceShapes(state, shapes, reducer);
}

export function reduceRight(state, reducer) {
  const shapes = getSortedShapes(state, (aBounds, bBounds) => (
    bBounds.x2 - aBounds.x2
  ));
  return reduceShapes(state, shapes, reducer);
}

export function reduceBottom(state, reducer) {
  const shapes = getSortedShapes(state, (aBounds, bBounds) => (
    aBounds.y2 - bBounds.y2
  ));
  return reduceShapes(state, shapes, reducer);
}

export function reduceLeft(state, reducer) {
  const shapes = getSortedShapes(state, (aBounds, bBounds) => (
    aBounds.x1 - bBounds.x1
  ));
  return reduceShapes(state, shapes, reducer);
}

function removeOutOfBoundsShapes(state) {
  return reduceLeft(state, (acc, shape) => (
    isOutOfBounds(acc, shape) === 1
      ? remove(acc, shape)
      : acc
  ));
}

export function move(state, shape, [x, y], callback = identity) {
  const shapeInState = getShape(state, shape);
  const nextState = position(
    remove(state, shapeInState),
    shapeInState,
    [x, y],
    (_, ...args) => callback(state, ...args),
  );

  if (nextState == null) {
    return null;
  }

  return removeOutOfBoundsShapes(nextState);
}

export default function getInitialState() {
  return new Immutable({});
}
