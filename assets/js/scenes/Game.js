export default class Game extends Phaser.Scene {
    constructor(){
        super('Game');
    }

    /*
        Este metodo se ejecuta una sola vez.
        Sirve para obtener los recursos o assets y ponerlos a disposicion
    */
    preload(){
        this.load.image('sea', '../../assets/images/sea.png'); // precarga del fondo
    }

    /*
        Este metodo se ejecuta una sola vez.
        Sirve para mostrar los recursos o assets
    */
    create(){
        this.sea = this.add.tileSprite(0, 0, 1600, 1200, 'sea'); // renderizacion del fondo
    }

    /*
        Este metodo se ejecuta cada frame.
        Sirve para actualizar los componentes. Da dinamismo.
    */
    update(){
        
    }
}