import { animated, flash } from 'animate.css';
import sample from 'lodash/sample';
import keys from 'lodash/keys';
import { isPlayable, setup, onGameOver, getGraph } from './lib/DOM';
import games from './games';

function gameOverAnimation(callback) {
  const graph = getGraph();

  function onAnimationEnd() {
    graph.removeEventListener('animationend', onAnimationEnd);
    graph.classList.remove(animated);
    graph.classList.remove(flash);
    callback();
  }

  graph.addEventListener('animationend', onAnimationEnd);
  graph.classList.add(animated);
  graph.classList.add(flash);
}

if (isPlayable()) {
  setup();

  const createGame = sample(games);
  keys(createGame.controls).forEach((key) => {
    console.info(`${key}: ${createGame.controls[key]}`);// eslint-disable-line no-console
  });

  onGameOver(gameOverAnimation.bind(null, createGame));
  createGame();
}
