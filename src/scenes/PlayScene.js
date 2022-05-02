import { Scene } from 'phaser';

export default class PlayScene extends Scene {
  constructor() {
    super({ key: 'PlayScene' });
  }

  preload() {
    this.load.image('star', '/static/star.png');
  }

  create() {
    this.add.image(
      game.config.width / 2,
      game.config.height / 2,
      'star'
    );
  }
}