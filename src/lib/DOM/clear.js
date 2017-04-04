import { clearLoop } from './loop';
import { clearKeyDownListeners } from './keyboard';

export default function clear() {
  clearLoop();
  clearKeyDownListeners();
}
