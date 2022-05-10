export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        console.info('se crea el player');

        super(scene, x, y, 'player');
        this.play('fly');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = 300;
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.body.setSize(20, 20, 0, -5);
        this.weaponLevel = 0;
        this.nextShotAt = 0;
        this.shotDelay = 100;
        this.scene = scene;
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
            if (this.scene.bullets.countActive() === 0) {
                return;
            }
            console.log(this.scene.bullets)
            bullet = this.scene.bullets.getFirstAlive();
            bullet.visible = true;
            console.log(bullet)
            bullet.body.reset(this.x, this.y - 20)
            bullet.body.velocity.y = -500;
        } else {
            if (this.scene.bullets.countDead() < this.weaponLevel * 2) {
                return;
            }
            for (var i = 0; i < this.weaponLevel; i++) {
                bullet = this.bulletPool.getFirstExists(false);
                bullet.reset(this.x - (10 + i * 6), this.y - 20);
                this.physics.velocityFromAngle(
                    -95 - i * 10, 500, bullet.body.velocity
                );

                bullet = this.scene.bullets.getFirstExists(false);
                bullet.reset(this.x + (10 + i * 6), this.y - 20);
                this.physics.velocityFromAngle(
                    -85 + i * 10, 500, bullet.body.velocity
                );
            }
        }
    }
}
