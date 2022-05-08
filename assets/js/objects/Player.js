export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y){
        console.info('se crea el player');
        
        super(scene, x, y, 'player');
        this.play('fly');
        scene.add.existing(this);
    }
}
    