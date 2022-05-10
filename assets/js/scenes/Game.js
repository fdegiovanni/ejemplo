import EnemyManager from '../objects/EnemyManager.js';
import Player from '../objects/Player.js';

export default class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.gameOverStatus = false;
    }

    /*
        Este metodo se ejecuta una sola vez.
        Sirve para obtener los recursos o assets y ponerlos a disposicion
    */
    preload() {
        this.load.image('sea', '../../assets/images/sea.png'); // precarga del fondo
        this.load.image('bullet', '../../assets/images/bullet.png'); // precarga de la municion del personaje
        this.load.image('enemyBullet', '../../assets/images/enemy-bullet.png'); // precarga de la municion del enemigo
        this.load.image('powerup1', '../../assets/images/powerup1.png'); // precarga del power up

        this.load.spritesheet('greenEnemy', '../../assets/images/enemy.png', { frameWidth: 32, frameHeight: 32 }); // precarga de secuencia de imagenes de enemigo verde
        this.load.spritesheet('whiteEnemy', '../../assets/images/shooting-enemy.png', { frameWidth: 32, frameHeight: 32 }); // precarga de secuencia de imagenes de enemigo blanco
        this.load.spritesheet('boss', '../../assets/images/boss.png', { frameWidth: 93, frameHeight: 75 }); // precarga de secuencia de imagenes de boss
        this.load.spritesheet('explosion', '../../assets/images/explosion.png', { frameWidth: 32, frameHeight: 32 }); // precarga de secuencia de imagenes de explosion
        this.load.spritesheet('player', '../../assets/images/player.png', { frameWidth: 64, frameHeight: 64 }); // precarga de secuencia de imagenes del personaje

        this.load.audio('explosion', '../../assets/sounds/explosion.ogg');
        this.load.audio('playerExplosion', '../../assets/sounds/player-explosion.ogg');
        this.load.audio('enemyFire', '../../assets/sounds/enemy-fire.ogg');
        this.load.audio('playerFire', '../../assets/sounds/player-fire.ogg');
        this.load.audio('fly', '../../assets/sounds/fly.wav');
        this.load.audio('powerUp', '../../assets/sounds/powerup.ogg');
    }

    /*
        Este metodo se ejecuta una sola vez.
        Sirve para mostrar los recursos o assets
    */
    create() {
        this.sea = this.add.tileSprite(0, 0, 1600, 1200, 'sea'); // renderizacion del fondo

        // se crea la animacion "fly" con el sprite del player
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // se crea la animacion "fly" con el sprite del enemy Green
        this.anims.create({
            key: 'fly-greenEnemy',
            frames: this.anims.generateFrameNumbers('greenEnemy', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        // se crea la animacion "fly" con el sprite del enemy White
        this.anims.create({
            key: 'fly-whiteEnemy',
            frames: this.anims.generateFrameNumbers('whiteEnemy', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        // se crea la animacion "hit" con el sprite del enemy Green
        this.anims.create({
            key: 'hit-greenEnemy',
            frames: this.anims.generateFrameNumbers('greenEnemy', [3, 1, 3, 2]),
            frameRate: 20,
            repeat: 0
        });

        // se crea la animacion "hit" con el sprite del enemy White
        this.anims.create({
            key: 'hit-whiteEnemy',
            frames: this.anims.generateFrameNumbers('whiteEnemy', [3, 1, 3, 2]),
            frameRate: 20,
            repeat: 0
        });

        // se crea la animacion "ghost" con el sprite del player
        this.anims.create({
            key: 'ghost',
            frames: this.anims.generateFrameNumbers('player', [3, 0, 3, 1]),
            frameRate: 20,
            repeat: true
        });

        // se crea la animacion de una explosion
        this.anims.create({
            key: 'boom',
            frames: this.anims.generateFrameNumbers('explosion'),
            repeat: false
        });

        this.player = new Player(this, 400, 550); // renderizacion del player

        /*
            Los enemigos son muchos, por lo que vamos a utilizar un grupo para tenerlos juntos
            Vamos a tener enemigos kamikazes (enemies) y enemigos que disparan (shooters)
        */
        this.enemies = this.physics.add.group();
        this.enemies.createMultiple({
            classType: Phaser.Physics.Arcade.Sprite,
            key: 'greenEnemy',
            frame: 0,
            visible: false,
            active: false,
            repeat: 5,
            setXY: {
                x: 400,
                y: 300,
            }
        });
        // console.log(this.enemies.children.entries.length);
        // console.log(this.enemies.children);

        this.enemies.children.entries.forEach((enemy) => {
            enemy.reward = 100;
            enemy.dropRate = 0.3;
            enemy.health = 2;
            enemy.type = 'greenEnemy';
            enemy.alive = true;
            

            enemy.body.enable = true;
            enemy.setCollideWorldBounds(true);
            enemy.body.onWorldBounds = true;
            enemy.body.world.on('worldbounds', function (body) {
                if (body.gameObject === this) {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }, enemy);
        });


        this.shooters = this.physics.add.group();
        this.shooters.createMultiple({
            classType: Phaser.Physics.Arcade.Sprite,
            key: 'whiteEnemy',
            frame: 0,
            visible: false,
            active: false,
            repeat: 5,
            setXY: {
                x: 400,
                y: 300,
            }
        });

        this.shooters.children.entries.forEach((shooter) => {
            
            shooter.reward = 400;
            shooter.dropRate = 0.5;
            shooter.health = 5;
            shooter.type = 'whiteEnemy';
            shooter.alive = true;
            
            shooter.setCollideWorldBounds(true);
            shooter.body.onWorldBounds = true;
            shooter.body.world.on('worldbounds', function (body) {
                if (body.gameObject === this) {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }, shooter);
        });



        /*
            Los enemigos son muchos y sus bullets mas, por lo que vamos a utilizar un grupo para tenerlas
        */
        this.enemiesBullets = this.physics.add.group();
        this.enemiesBullets.createMultiple({
            classType: Phaser.Physics.Arcade.Sprite,
            key: 'enemyBullet',
            frame: 0,
            visible: false,
            active: false,
            repeat: 100,
            setXY: {
                x: 600,
                y: 300,
            }
        });
        this.enemiesBullets.children.entries.forEach((bullet) => {
            bullet.setCollideWorldBounds(true);
            bullet.body.onWorldBounds = true;
            bullet.body.world.on('worldbounds', function (body) {
                if (body.gameObject === this) {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }, bullet);
        });

        /*
            Las bullets del player son muchas, por lo que vamos a utilizar un grupo para tenerlas
        */
        this.bullets = this.physics.add.group();
        this.bullets.createMultiple({
            classType: Phaser.Physics.Arcade.Sprite,
            key: 'bullet',
            frame: 0,
            visible: false,
            active: false,
            repeat: 100,
            setXY: {
                x: 400,
                y: 550,
            }
        });
        this.bullets.children.entries.forEach((bullet) => {
            bullet.setCollideWorldBounds(true);
            bullet.body.onWorldBounds = true;
            bullet.body.world.on('worldbounds', function (body) {
                if (body.gameObject === this) {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }, bullet);
        });

        this.explosions = this.physics.add.group();
        this.explosions.createMultiple({
            classType: Phaser.Physics.Arcade.Sprite,
            key: 'explosion',
            frame: 0,
            visible: false,
            active: false,
            repeat: 100,
            setXY: {
                x: 400,
                y: 300,
            }
        });

        // Mostrar vidas del jugador
        this.lives = this.add.group();
        const firstLifeIconX = 800 - 10 - (3 * 30);
        for (let i = 0; i < 3; i++) {
            const life = this.lives.create(firstLifeIconX + (30 * i), 30, 'player');
            //life.body.setSize(10, 10, 0, -5)
            life.displayWidth = 30;

            // extra line to scale the image proportional
            life.scaleY = life.scaleX;
        }

        // Mostrar instrucciones en la pantalla
        this.instructions = this.add.text(40, 450,
            'Usa las Arrow Keys para mover, Presiona ESPACIO para disparar\n' +
            'Tapea/cliquea para hacer ambas',
            { font: '20px monospace', fill: '#fff', align: 'center' }
        );
        this.instructionsExpire = this.time.now + 2500;

        // Mostrar puntaje en la mantalla
        this.score = 0;
        this.scoreText = this.add.text(
            400, 30, '' + this.score,
            { font: '20px monospace', fill: '#fff', align: 'center' }
        );


        this.cursors = this.input.keyboard.createCursorKeys(); // Permite capturar los eventos del teclado

        this.enemyManager = new EnemyManager(this); // Manejador de todo lo relacionado con los enemigos

        // Colisiones y overlaps
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.bullets, this.shooters, this.hitEnemy, null, this);

        this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player, this.shooters, this.hitPlayer, null, this);

        this.physics.add.overlap(this.player, this.enemiesBullets, this.hitPlayer, null, this);

        this.setupAudio();
    }

    /*
        Este metodo se ejecuta cada frame.
        Sirve para actualizar los componentes. Da dinamismo.
    */
    update() {
        if(this.gameOverStatus) {
            return;
        }
        
        this.sea.tilePositionY -= 0.12; // le damos al fondo un movimiento contrario al avance del personaje

        // Contolar al player con las arrows keys
        if (this.player.body) {
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;

            if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -this.player.speed;
            } else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = this.player.speed;
            }

            if (this.cursors.up.isDown) {
                this.player.body.velocity.y = -this.player.speed;
            } else if (this.cursors.down.isDown) {
                this.player.body.velocity.y = this.player.speed;
            }

            // Contolar al player via mouse/pointer
            if (this.input.activePointer.isDown &&
                Phaser.Math.Distance.Between(this.input.activePointer.worldX, this.input.activePointer.worldY, this.player.x, this.player.y) > 15) {
                this.physics.moveTo(this.player, this.input.activePointer.worldX, this.input.activePointer.worldY, 300);
            }

            // Permitir al player disparar: con la SPACE o con el clic
            if (this.cursors.space.isDown || this.input.activePointer.isDown) {
                // Si el juego termino cerrarlo, sino disparar
                if (this.returnText && this.returnText.exists) {
                    // cerrar el juego
                } else {
                    this.player.fire();
                }
            }
        }



        this.enemyManager.spawn();
        this.enemyManager.fire();

        if (this.instructions && this.time.now > this.instructionsExpire) {
            this.instructions.destroy();
        }
    }

    hitPlayer(player, enemy) {
        console.log('ouch')

        this.playerExplosionSFX.play();

        if (enemy?.alive) {
            this.damageEnemy(enemy, 5);
        } else {
            enemy.active = false;
            enemy.visible = false;
        }

        if (this.player.lives >= 0) {
            console.log('le dieron al player')
            this.player.lives--;
            this.player.weaponLevel = 0;
            this.player.play('ghost');
            const life = this.lives.getFirstAlive();
            if (life !== null) {
                life.visible = false
                life.active = false;
                this.lives.kill(life);
                console.log('se quita corazon')
            }

        } else {
            // matar al personaje
            this.explode(player);
            this.gameOver();
        }


    }

    hitEnemy(bullet, enemy) {
        bullet.setActive(false);
        this.damageEnemy(enemy, 1);
    }

    damageEnemy(enemy, damage) {
        enemy.damage(enemy, damage);
        if (enemy?.alive) {
            enemy.play(`hit-${enemy.type}`);
        } else {
            this.explode(enemy);
            this.explosionSFX.play();
            this.addToScore(enemy.reward);
        }
    }

    explode(sprite) {
        if (this.explosions.countActive(false) === 0) {
            return;
        }
        var explosion = this.explosions.getFirstDead();
        explosion.setActive(true).setVisible(true).body.reset(sprite.x, sprite.y);
        explosion.play('boom', 15, false, true);

        // Se le da a la explosion la direccion del objeto
        explosion.body.velocity.x = sprite.body.velocity.x;
        explosion.body.velocity.y = sprite.body.velocity.y;
    }

    addToScore(score) {
        this.score += score;
        this.scoreText.text = this.score;
    }

    setupAudio() {
        this.sound.volume = 0.3;
        this.sound.add('fly', {
            volume: 1.5,
            loop: true,
        }).play();
        this.explosionSFX = this.sound.add('explosion');
        this.playerExplosionSFX = this.sound.add('playerExplosion');
        this.enemyFireSFX = this.sound.add('enemyFire');
        this.playerFireSFX = this.sound.add('playerFire');
    }

    gameOver() {     
        this.sound.stopAll(); 
        setTimeout(() => this.scene.start('GameOver'), 1200);   
        
    }
}