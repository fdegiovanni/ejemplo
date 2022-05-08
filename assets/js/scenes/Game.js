import Player from '../objects/Player.js';

export default class Game extends Phaser.Scene {
    constructor() {
        super('Game');
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

        // se crea la animacion "fly" con el sprite del enemyGreen
        this.anims.create({
            key: 'fly-greenEnemy',
            frames: this.anims.generateFrameNumbers('greenEnemy', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.player = new Player(this, 400, 550); // renderizacion del player

        /*
            Los enemigos son muchos, por lo que vamos a utilizar un grupo para tenerlos juntos
        */
        this.enemies = this.physics.add.group();
        this.enemies.createMultiple({
            classType: Phaser.GameObjects.Sprite,
            key: 'greenEnemy',
            frame: 0,
            visible: true,
            active: true,
            repeat: 50,
            setXY: {
                x: 400,
                y: 300,
            }
        });
        console.log(this.enemies.children.entries.length);
        console.log(this.enemies.children);

        this.enemies.children.entries.forEach((enemy) => {
            enemy.play('fly-greenEnemy');
        });

        /*
            Los enemigos son muchos y sus bullets mas, por lo que vamos a utilizar un grupo para tenerlas
        */
        this.enemiesBullets = this.physics.add.group();
        this.enemiesBullets.createMultiple({
            classType: Phaser.GameObjects.Sprite,
            key: 'enemyBullet',
            frame: 0,
            visible: true,
            active: true,
            repeat: 100,
            setXY: {
                x: 600,
                y: 300,
            }
        });

        /*
            Las bullets del player son muchas, por lo que vamos a utilizar un grupo para tenerlas
        */
        this.bullets = this.physics.add.group();
        this.bullets.createMultiple({
            classType: Phaser.GameObjects.Sprite,
            key: 'bullet',
            frame: 0,
            visible: true,
            active: true,
            repeat: 100,
            setXY: {
                x: 600,
                y: 550,
            }
        });

        // Mostrar instrucciones en la pantalla
        this.instructions = this.add.text(80, 450,
            'Usa las Arrow Keys para mover, Presiona Z para disparar\n' +
            'Tapea/cliquea para hacer ambas',
            { font: '20px monospace', fill: '#fff', align: 'center' }
        );
        this.instExpire = this.time.now + 450;

        // Mostrar puntaje en la mantalla
        this.score = 0;
        this.scoreText = this.add.text(
            400, 30, '' + this.score,
            { font: '20px monospace', fill: '#fff', align: 'center' }
        );


        this.cursors = this.input.keyboard.createCursorKeys(); // Permite capturar los eventos del teclado
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    }

    /*
        Este metodo se ejecuta cada frame.
        Sirve para actualizar los componentes. Da dinamismo.
    */
    update() {
        this.sea.tilePositionY -= 0.12; // le damos al fondo un movimiento contrario al avance del personaje

        // Contolar al player con las arrows keys
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

        // Permitir al player disparar: con la Z o con el clic
        if (this.keyZ.isDown || this.input.activePointer.isDown) {
            // Si el juego termino cerrarlo, sino disparar
            if (this.returnText && this.returnText.exists) {
                // cerrar el juego
            } else {
                // disparar
            }
        }
    }

}