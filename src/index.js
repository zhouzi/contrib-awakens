import sample from 'lodash/sample';
import keys from 'lodash/keys';
import { isPlayable, setup, onGameOver } from './lib/DOM';
import games from './games';

if (isPlayable()) {
  setup();

  const createGame = sample(games);
  keys(createGame.controls).forEach((key) => {
    console.info(`${key}: ${createGame.controls[key]}`);// eslint-disable-line no-console
  });

  onGameOver(createGame);
  createGame();
}
