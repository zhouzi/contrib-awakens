import { clearLoop } from './loop';
import { removeKeyDownListener } from './keyboard';

export default function clear() {
  clearLoop();
  removeKeyDownListener();
}
