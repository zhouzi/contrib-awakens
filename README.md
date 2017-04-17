# contrib-awakens

Play games in GitHub's contribution graph.

> Brace yourselves, the little squares are coming.
> They've been silent for long but are now awake, hungry and up for some games!

* [Play]()
* [Install](#install)
* [Documentation](#documentation)

## Install

```
git clone git@github.com:{user}/contrib-awakens.git
npm install
```

**Available scripts**

* `npm run test` runs the tests.
* `npm run test:dev` runs the tests and watch for changes.
* `npm run lint` runs the linter and fix the smallest issues.
* `npm run build` bundle files for production.
* `npm run dev` bundle files for development and watch for changes.
* `npm run package` zip files to be published on the store.

## Documentation

If you want to create a new game, have a look at the existing ones.
It will give you a good and practical sense of the API.

### `getInitialState(): State`

Returns an empty state which is an immutable object.

**Example**

```javascript
import getInitialState from '../../lib';

const state = getInitialState();

console.log(state);
/*
  {}
*/
```

### `Shape(name: string, schema: array, meta = {}: object): Shape`

Creates a shape object.

**Example**

```javascript
import { Shape } from '../../lib';

const car = Shape('car', [
    ['green', 'green'],
]);

console.log(car);
/*
  {
    '0.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
    '1.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
  }
*/
```

### `position(state: State, shape: Shape, [x, y]: [number, number], onCollision = identity: function): State|any`

Position a shape in the state.

The `onCollision` function is called when trying to position a shape over another.
It receives two arguments:

* `previousState: State` the state before calling position.
* `collidingPoints: [Point]` the list of points that the shape would collide with.

When `onCollision` is called, `position` returns its return value.
By default `onCollision` is set to `identity` which means the previous state is returned.

Note: you must return `null` when the game is over.

**Example**

```javascript
import getInitialState, { Shape, position } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
]);
const state = position(getInitialState(), car, [2, 0]);

console.log(state);
/*
  {
    '2.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
    '3.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
  }
*/
```

### `move(state: State, shape: Shape, [x, y]: [number, number], onCollision = identity: function): State|any`

Move a shape to another position, *relative to its current position*.
It's important to keep in mind that `move` doesn't treat `x` and `y` as an absolute position.
Moving an object to `[1, 0]` will result in moving it 1 cell to the right.

The difference with `position` is that `move` position the shape to a new position and removes it from its previous one.

The `onCollision` function is called when trying to position a shape over another.
It receives two arguments:

* `previousState: State` the state before calling move.
* `collidingPoints: [Point]` the list of points that the shape would collide with.

When `onCollision` is called, `move` returns its return value.
By default `onCollision` is set to `identity` which means the previous state is returned.

Note: you must return `null` when the game is over.

**Example**

```javascript
import getInitialState, { Shape, position, move } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
]);
const state = move(
  position(getInitialState(), car, [2, 0]),
  car,
  [1, 0],
);

console.log(state);
/*
  {
    '3.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
    '4.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
  }
*/
```

### `remove(state: State, shape: Shape): State`

Remove a shape from state.

**Example**

```javascript
import getInitialState, { Shape, position, remove } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
]);
const state = remove(
  position(getInitialState, car, [0, 0]),
  car,
);

console.log(state);
/*
  {}
*/
```

### `removeBy(state: State, predicate: function): State`

Remove every points that `predicate` returns true for.

**Example**

```javascript
import getInitialState, { Shape, position, removeBy } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
]);
const state = removeBy(
  position(getInitialState, car, [0, 0]),
  point => point.name === 'car',
);

console.log(state);
/*
  {}
*/
```

### `isOutOfBounds(state: State, shape: Shape): number`

Return the percentage (between 0 and 1) of `shape` that is out of bounds.

**Example**

```javascript
import getInitialState, { Shape, position, isOutOfBounds } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
]);
const outOfBounds = isOutOfBounds(
  position(getInitialState, car, [-1, 0]),
  car,
);

console.log(outOfBounds);
/*
  0.5
*/
```

### `getShape(state: State, shape: Shape): Shape`

Return the provided shape as it is in state.

**Example**

```javascript
import getInitialState, { Shape, position, getShape } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
]);
const shape = getShape(
  position(getInitialState(), car, [2, 0]),
  car,
);

console.log(shape);
/*
  {
    '2.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
    '3.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
  }
*/
```

### `getShapes(state: State): Shape[]`

Return an array of all the shapes in state.

**Example**

```javascript
import getInitialState, { Shape, position, getShapes } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
]);
const shapes = getShapes(
  position(getInitialState(), car, [2, 0]),
);

console.log(shapes);
/*
  [
    {
      '2.0': {
        id: 'car-1',
        name: 'car',
        color: 'green',
        meta: {},
      },
      '3.0': {
        id: 'car-1',
        name: 'car',
        color: 'green',
        meta: {},
      },
    },
  ]
*/
```

### `getShapeBounds(shape: Shape): object`

Return a shape's bounds.

**Example**

```javascript
import getInitialState, { Shape, position, getShapeBounds } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
]);
const bounds = getShapeBounds(
  position(getInitialState(), car, [2, 0]),
);

console.log(bounds);
/*
  {
    x1: 2,
    x2: 3,
    y1: 0,
    y2: 0,
  }
*/
```

### `reduceTop(state: State, reducer: function): State`

Calls `reducer` for each shapes in state, starting by the top most one.

The `reducer` function receives two arguments:

* `acc: State` a state object, result of the previous call to `reducer`.
* `shape: Shape` a shape object.

You must return `null` when the game is over and if you do so, `reduceTop` returns early.

**Example**

```javascript
import getInitialState, { Shape, position, move, reduceTop } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
]);
const state = reduceTop(
  position(getInitialState(), car, [2, 0]),
  (acc, shape) => move(acc, shape, [1, 0]),
);

console.log(state);
/*
  {
    '3.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
    '4.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
  }
*/
```

### `reduceRight(state: State, reducer: function): State`

Calls `reducer` for each shapes in state, starting by the right most one.

The `reducer` function receives two arguments:

* `acc: State` a state object, result of the previous call to `reducer`.
* `shape: Shape` a shape object.

You must return `null` when the game is over and if you do so, `reduceRight` returns early.

**Example**

```javascript
import getInitialState, { Shape, position, move, reduceRight } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
]);
const state = reduceRight(
  position(getInitialState(), car, [2, 0]),
  (acc, shape) => move(acc, shape, [1, 0]),
);

console.log(state);
/*
  {
    '3.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
    '4.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
  }
*/
```

### `reduceBottom(state: State, reducer: function): State`

Calls `reducer` for each shapes in state, starting by the bottom most one.

The `reducer` function receives two arguments:

* `acc: State` a state object, result of the previous call to `reducer`.
* `shape: Shape` a shape object.

You must return `null` when the game is over and if you do so, `reduceBottom` returns early.

**Example**

```javascript
import getInitialState, { Shape, position, move, reduceBottom } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
]);
const state = reduceBottom(
  position(getInitialState(), car, [2, 0]),
  (acc, shape) => move(acc, shape, [1, 0]),
);

console.log(state);
/*
  {
    '3.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
    '4.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
  }
*/
```

### `reduceLeft(state: State, reducer: function): State`

Calls `reducer` for each shapes in state, starting by the left most one.

The `reducer` function receives two arguments:

* `acc: State` a state object, result of the previous call to `reducer`.
* `shape: Shape` a shape object.

You must return `null` when the game is over and if you do so, `reduceLeft` returns early.

**Example**

```javascript
import getInitialState, { Shape, position, move, reduceLeft } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
]);
const state = reduceLeft(
  position(getInitialState(), car, [2, 0]),
  (acc, shape) => move(acc, shape, [1, 0]),
);

console.log(state);
/*
  {
    '3.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
    '4.0': {
      id: 'car-1',
      name: 'car',
      color: 'green',
      meta: {},
    },
  }
*/
```

### `getShapeId(shape: Shape): string`

Return a shape's unique identifier.

**Example**

```javascript
import { Shape, getShapeId } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
]);
const id = getShapeId(car);

console.log(id);
/*
  'car-1'
*/
```

### `getShapeName(shape: Shape): string`

Return a shape's name.

**Example**

```javascript
import { Shape, getShapeName } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
]);
const name = getShapeName(car);

console.log(name);
/*
  'car'
*/
```

### `getShapeMeta(shape: Shape): object`

Return a shape's meta.

**Example**

```javascript
import { Shape, getShapeMeta } from '../../lib';

const car = Shape('car', [
  ['green', 'green'],
], { speed: 'fast' });
const meta = getShapeMeta(car);

console.log(meta);
/*
  {
    speed: 'fast'
  }
*/
```

### `parseCoord(coord: string): [number, number]`

Parse a stringified coordinate and returns its `x` and `y`.

**Example**

```javascript
import { parseCoord } from '../../lib';

const [x, y] = parseCoord('1.0');

console.log(x, y);
/*
  1 0
*/
```

### `stringifyCoord([x, y]: [number, number]): string`

Stringify `x` and `y` coordinates.

**Example**

```javascript
import { stringifyCoord } from '../../lib';

const coord = stringifyCoord([1, 0]);

console.log(coord);
/*
  '1.0'
*/
```

### `pipeline(fns: function[], initialResult: any, done = identity: function): any`

Works like a reducer, except it returns early when `null` is encountered.
Especially useful to chain actions but prevent from manipulating a `null` state caused by a game over.

**Example**

```javascript
import { pipeline } from '../../lib';

const result = pipeline([
  acc => `${acc}.b`,
  () => null,
  acc => acc.split('.'),
], 'a');

console.log(result);
/*
  null
*/
```

### `throttle(fn: function, delay: number, min = 0: number, max = Infinity: number): function`

Call `fn` maximum 1 time every `delay`.
When `fn` is not called, the first argument passed to it is returned.

The return function has itself two useful functions:

* `decreaseDelay(decrement: number): void` decrement the minimum delay between each call. If the result is inferior to `min`, `min` will be used instead.
* `increaseDelay(increment: number): void` increment the minimum delay between each call. If the result is superior to `max`, `max` will be used instead.

**Example**

```javascript
import { throttle } from '../../lib';

const log = throttle(() => 'hello');

log();
log();
/*
  'hello'
*/
```

### `sometimes(fn: function, min: number, max: number): function`

Call `fn` `min` times out of `max`.
When `fn` is not called, the first argument passed to it is returned.

**Example**

```javascript
import { sometimes } from '../../lib';

const incrementSometimes = sometimes(n => n + 1, 1, 2);

console.log(incrementSometimes(0));
/*
  0
*/

console.log(incrementSometimes(0));
/*
  1
*/
```
