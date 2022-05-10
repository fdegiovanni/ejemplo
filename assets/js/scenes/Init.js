export default class Init extends Phaser.Scene {
    constructor() {
        super('Init');
    }

    preload() {
        this.load.image('logo', '../../assets/images/1942_Capcom_Logo.png'); // precarga del logo
        
    }

    create(){
        const logo = this.add.image(400, 200, 'logo')//.setScale(0.26)
        logo.setInteractive()
        logo.on('pointerdown', () => this.scene.start('Game') );
    }
}