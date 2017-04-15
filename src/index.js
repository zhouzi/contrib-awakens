import sample from 'lodash/sample';
import { isPlayable, setup, onGameOver } from './lib/DOM';
import games from './games';

if (isPlayable()) {
  setup();

  const createGame = sample(games);

  onGameOver(createGame);
  createGame();
}
