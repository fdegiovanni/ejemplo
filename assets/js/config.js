import Game from "./scenes/Game.js";
import GameOver from "./scenes/GameOver.js";
import Init from "./scenes/Init.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Init, Game, GameOver],
    physics: {
        default: 'arcade',
    },
};

export { config };