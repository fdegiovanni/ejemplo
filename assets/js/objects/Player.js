export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        console.info('se crea el player');
        
        super(scene, x, y, 'player');
        this.play('fly');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = 300;
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.body.setSize(20, 20, 0, -5);
        // this.setVelocity(0, -200);
    }
    
}
    