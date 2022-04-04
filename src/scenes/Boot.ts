
export default class Boot extends Phaser.Scene {

  constructor() {
    super({
      key: "Boot",
    });
  }

  preload() {
    this.load.image("logo", "assets/images/logo.png");
    this.load.bitmapFont(
      "arcade",
      "assets/fonts/arcade.png",
      "assets/fonts/arcade.xml"
    );

    var graphics = this.make.graphics({ x: 0, y: 0, add: false });

    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, 1280, 600);
    graphics.generateTexture("black-screen", 1280, 600);


    
  }

  init(){ }

  create() { this.scene.start("Preloader"); }

  update() {}
}
