import Immutable from 'seamless-immutable';
import DOM from './DOM';

function fromState(state) {
  function updateCell(x, y, props) {
    const nextState = state.update(x, col => col.set(y, col[y].merge(props)));
    return fromState(DOM.render(nextState));
  }

  return {
    updateCell,
  };
}

function getState() {
  const state = new Immutable(DOM.readState());
  return fromState(state);
}

export default getState;
