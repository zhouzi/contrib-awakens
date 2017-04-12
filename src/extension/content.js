import sample from 'lodash/sample';
import { setup, onGameOver } from '../lib/DOM';
import games from './games';

setup();

const createGame = sample(games);

onGameOver(createGame);
createGame();
