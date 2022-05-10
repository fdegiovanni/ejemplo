export default class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create(){
        this.add.text(
            200, 90, 'GAME OVER',
            { font: '80px monospace', fill: '#fff', align: 'center' }
        );

        this.add.text(400, 300, 'Reintentar', { fontFamily: 'Times New Roman', fontSize: 40, color: '#ff0000' })
        .setInteractive()
        .on('pointerdown', () => this.scene.start('Init'));        
        
    }
}