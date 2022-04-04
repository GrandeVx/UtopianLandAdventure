import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";

export default class Intro extends Phaser.Scene {
  private _logo: Phaser.GameObjects.Image;
  private _bg: Phaser.GameObjects.TileSprite;
  private _play: Phaser.GameObjects.Image;
  private _credits: Phaser.GameObjects.Image;

  constructor() {
    super({
      key: "Intro",
    });
  }

  preload() {


    // load music
    this.load.audio("lobby", "assets/audio/lobby.mp3");

  }

  create() {


    this._bg = this.add.tileSprite(this.game.canvas.width / 2, this.game.canvas.height / 2 + 50 , 1600, 1896, "bg-intro").setOrigin(0.5).setScale(1.2);

    this.add.tween({
      targets: this._bg,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      x: { from: this._bg.x, to: this._bg.x + 300 },
      y: { from: this._bg.y, to: this._bg.y + 300 },
    })
    
    this._logo = this.add.image(this.game.canvas.width / 2, 50,"title").setAlpha(0).setScale(0.5);
    this.add.tween({
      targets: this._logo, y: 150, alpha: 1, duration: 1000, ease: "quad.easeInOut",

      onComplete: () => {
        this.add.tween({
          targets: this._logo, y: 130, repeat: -1, yoyo: true, duration: 1000, ease: "quad.easeInOut",
        });
      }
    });
    
    this._play = this.add.image(this.game.canvas.width / 2, 400 ,"start")
      .setAlpha(1)
      .setScale(0.30)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(100)

      .on("pointerup", () => {
        this._play.removeInteractive();
        this.startGame();
      })
      .on("pointerover", () => {
        this._play.setTint(0xff0000);
      })
      .on("pointerout", () => {
         this._play.setTint(0xff8200);
      });

      this._credits = this.add.image(this.game.canvas.width / 2,500 ,"credits")
      .setAlpha(1)
      .setScale(0.25)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(100)
      
      .on("pointerup", () => {
        this._play.removeInteractive();
       //
        this.openCrediti();
      })
      .on("pointerover", () => {
         this._play.setTint(0xff0000);
      })
      .on("pointerout", () => {
          this._play.setTint(0xff8200);
      });


      // start music
      this.sound.play("lobby", {
        volume: 0.5,
        loop: true,
      });
      
  }


  startGame() {

    this.scene.stop("Intro");
    this.scene.start("GamePlay");
    this.scene.start("TimerBar")
    this.scene.bringToTop("TimerBar");
    this.scene.start("BatteryBar");
    this.scene.bringToTop("BatteryBar");
    this.scene.start("ReputationBar");
    this.scene.bringToTop("ReputationBar");
    this.scene.start("Hud");
    this.scene.bringToTop("Hud");
    this.scene.start("Message");
    this.scene.bringToTop("Message");
   // if (this.sys.game.device.input.touch) {}
  }

  openCrediti(){
    this.scene.stop("Intro");
    this.scene.start("Crediti");
  }

}

