import { Game, AUTO } from 'phaser';
import PlayScene from './src/scenes/PlayScene';

const config = {
  name: 'app',
  type: AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [PlayScene],
};

window.game = new Game(config);