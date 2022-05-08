export default class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.nextEnemyAt = 0;
        this.enemyDelay = 1000;
        this.nextShooterAt = this.scene.time.now + 5000;
        this.shooterDelay = 3000;
    }

    spawn() {
        if (this.nextEnemyAt < this.scene.time.now && this.scene.enemies.countActive(false) > 0) {
            this.nextEnemyAt = this.scene.time.now + this.enemyDelay;

            const enemy = this.scene.enemies.getFirstDead();
            enemy.setActive(true).setVisible(true).body.reset(Phaser.Math.Between(20, 780), 20);
            enemy.body.velocity.y = Phaser.Math.Between(30, 60);
            enemy.play('fly-greenEnemy');
            // console.log('enemy', enemy);
        }

        if (this.nextShooterAt < this.scene.time.now && this.scene.shooters.countActive(false) > 0) {
            this.nextShooterAt = this.scene.time.now + this.shooterDelay;
            const shooter = this.scene.shooters.getFirstDead();
            shooter.setActive(true).setVisible(true).body.reset(Phaser.Math.Between(20, 780), 20);

            // Volar hacia un punto random
            // Obtener un destino
            var target = { x: Phaser.Math.Between(20, 780), y: Phaser.Math.Between(300, 590) };

            // moverse hacia el destino, girando
            shooter.rotation = this.scene.physics.moveToObject(shooter, target, Phaser.Math.Between(20, 60)) - Math.PI / 2;
            shooter.play('fly-whiteEnemy');
            // Cada shooter tiene su propio tiempo
            shooter.nextShotAt = 0;
            // console.log('shooter', shooter)
        }
    }

    fire() {
        this.scene.shooters.children.entries.forEach((enemy) => {
            console.log('shoot');
            if (this.scene.time.now > enemy.nextShotAt && this.scene.enemiesBullets.countActive(false) > 0) {
                console.log('shoot enemy');
                const bullet = this.scene.enemiesBullets.getFirstDead();
                bullet.setActive(true).setVisible(true).body.reset(enemy.x, enemy.y);
                this.scene.physics.moveToObject(bullet, this.scene.player, 150);
                enemy.nextShotAt = this.scene.time.now + 2000;
            }
        }, this.scene);
    }
}