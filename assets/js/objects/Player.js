export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        console.info('se crea el player');

        super(scene, x, y, 'player');
        this.play('fly');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.speed = 300;
        this.enableBody = true;
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.body.onOverlap = true;
        this.body.setSize(20, 20, 0, -5);
        this.weaponLevel = 0;
        this.nextShotAt = 0;
        this.shotDelay = 400;
        this.lives = 3;
    }

    fire() {
        console.log('bang!');
        // Si el player esta muerto o no puede disparar no hace nada
        if (this.nextShotAt > this.scene.time.now) {
            return;
        }

        this.nextShotAt = this.scene.time.now + this.shotDelay;

        let bullet;
        if (this.weaponLevel === 0) {
            if (this.scene.bullets.countActive(false)=== 0) {
                return;
            }
            bullet = this.scene.bullets.getFirstDead();
            bullet.setActive(true).setVisible(true).body.reset(this.x, this.y - 20)
            bullet.body.velocity.y = -500;
        } else {
            if (this.scene.bullets.countActive(false) < this.weaponLevel * 2) {
                return;
            }
            for (var i = 0; i < this.weaponLevel; i++) {
                bullet = this.scene.bullets.getFirstDead();
                bullet.body.reset(this.x - (10 + i * 6), this.y - 20);
                this.physics.velocityFromAngle(
                    -95 - i * 10, 500, bullet.body.velocity
                );

                bullet = this.scene.bullets.getFirstDead();
                bullet.body.reset(this.x + (10 + i * 6), this.y - 20);
                this.physics.velocityFromAngle(
                    -85 + i * 10, 500, bullet.body.velocity
                );
            }
        }
    }
}
