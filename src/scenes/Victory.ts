export default class Victory extends Phaser.Scene {

  private _Victory: Phaser.GameObjects.Image;
  private _continue: Phaser.GameObjects.Image;
  private _exit: Phaser.GameObjects.Image;
  private _bg: Phaser.GameObjects.TileSprite;

  constructor() {
    super({
      key: "Victory",
    });
  }

  create() {
  
    this._bg = this.add.tileSprite(this.game.canvas.width / 2, this.game.canvas.height / 2 + 50 , 1600, 1896, "bg-victory").setOrigin(0.5).setScale(1.2);

    this._Victory = this.add.image(this.game.canvas.width / 2, 50,"lcomplete").setAlpha(0).setScale(0.5);
    this.add.tween({
      targets: this._Victory, y: 150, alpha: 1, duration: 1000, ease: "quad.easeInOut",

      onComplete: () => {
        this.add.tween({
          targets: this._Victory, y: 130, repeat: -1, yoyo: true, duration: 1000, ease: "quad.easeInOut",
        });
      }
    });
    
    this._continue = this.add.image(this.game.canvas.width / 2, 400 ,"continue")
      .setAlpha(1)
      .setScale(0.30)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(100)

      .on("pointerup", () => {
        this._continue.removeInteractive();
        this.restartGame();
      })
      .on("pointerover", () => {
        this._continue.setTint(0xff0000);
      })
      .on("pointerout", () => {
         this._continue.setTint(0xff8200);
      });
  }

   intro() {
  
      this.scene.stop("GameOver");
      this.scene.start("Intro");
      
   }

   restartGame() {
  
      this.scene.stop("GameOver");
      this.scene.start("GamePlay");
      this.scene.bringToTop("GamePlay");
      this.scene.start("Hud");
      this.scene.bringToTop("Hud");
      this.scene.bringToTop("TimerBar");
      this.scene.bringToTop("ReputationBar");
      this.scene.bringToTop("BatteryBar");
      this.scene.bringToTop("Message");
     
   }
  
  

}
