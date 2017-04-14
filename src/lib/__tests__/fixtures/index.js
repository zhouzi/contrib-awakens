import { Shape } from '../../';

export function Car(meta) {
  return Shape('car', [
    ['red', 'red'],
  ], meta);
}

export function Ship() {
  return Shape('ship', [
    ['green', null],
    [null, 'blue'],
    ['green', null],
  ]);
}

export function Boat() {
  return Shape('boat', [
    ['blue', 'blue', 'blue'],
  ]);
}

export default {
  Car,
  Ship,
  Boat,
};
