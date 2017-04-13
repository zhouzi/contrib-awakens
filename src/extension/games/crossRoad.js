import keys from 'lodash/keys';
import head from 'lodash/head';
import range from 'lodash/range';
import sample from 'lodash/sample';
import getInitialState, {
  Shape,
  position,
  move,
  isOutOfBounds,
  getShapes,
  getShapeName,
  getShapeMeta,
  parseCoord,
  reduceTop,
  reduceBottom,
  removeOutOfBoundsShapes,
  bounds,
  directions,
} from '../../lib';
import throttle from '../../lib/throttle';
import render, { loop, onKeyDown, keyCodes } from '../../lib/DOM';
import colors from '../../lib/colors.json';

export default function createCrossRoad() {
  const character = Shape('character', [
    [colors.LIGHT],
  ]);
  let state = position(getInitialState(), character, [bounds.x.min + 1, bounds.y.middle]);

  function moveCharacter(direction) {
    const nextState = move(state, character, direction, () => null);
    if (nextState == null) {
      state = null;
    } else if (isOutOfBounds(nextState, character) === 0) {
      state = nextState;
    }
  }

  const spawnCar = throttle(() => {
    const nonEmptyX = getShapes(state)
      .filter(shape => getShapeName(shape) === 'car')
      .map(shape => keys(shape).map(coord => head(parseCoord(coord))))
      .reduce((acc, x) => acc.concat(x), []);
    const emptyX = range(bounds.x.min + 3, bounds.x.max - 3).filter(x => nonEmptyX.indexOf(x) === -1);
    const x = sample(emptyX);
    const direction = sample(['TOP', 'BOTTOM']);
    const y = direction === 'BOTTOM' ? bounds.y.min - 1 : bounds.y.max;
    const color = sample([colors.DARK, colors.DARKER]);
    const speed = sample(['slow', 'fast']);
    const car = Shape('car', [
      [color],
      [color],
    ], { direction, speed });
    state = position(state, car, [x, y]);
  }, 500);
  function moveCarsReducer(dir) {
    return (state, shape) => {
      const name = getShapeName(shape);
      const { direction } = getShapeMeta(shape);
      if (name === 'car' && direction === dir) {
        return move(state, shape, directions[dir], () => null);
      }

      return state;
    };
  }
  function moveCarsWithSpeed(speed) {
    return () => {
      state = reduceTop(state, moveCarsReducer('BOTTOM', speed));

      if (state != null) {
        state = reduceBottom(state, moveCarsReducer('TOP', speed));
      }
    };
  }
  const moveSlowCars = throttle(moveCarsWithSpeed('slow'), 500);
  const moveFastCars = throttle(moveCarsWithSpeed('fast'), 250);

  loop(() => {
    if (state != null) {
      moveSlowCars();
    }

    if (state != null) {
      moveFastCars();
    }

    if (state != null) {
      state = removeOutOfBoundsShapes(state);
      spawnCar();
    }

    render(state);
  });

  onKeyDown({
    [keyCodes.TOP]: moveCharacter.bind(null, directions.TOP),
    [keyCodes.RIGHT]: moveCharacter.bind(null, directions.RIGHT),
    [keyCodes.BOTTOM]: moveCharacter.bind(null, directions.BOTTOM),
    [keyCodes.LEFT]: moveCharacter.bind(null, directions.LEFT),
  });
}
