import createCarDodge from './games/carDodge'

function startGame() {
  createCarDodge(() => {
    alert('Game Over!');
    startGame();
  });
}

startGame();
