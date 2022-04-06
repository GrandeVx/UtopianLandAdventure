export default class GameOver extends Phaser.Scene {

  private _GameOver: Phaser.GameObjects.Image;
  private _intro: Phaser.GameObjects.BitmapText;
  private _restart: Phaser.GameObjects.BitmapText;
  private _bg: Phaser.GameObjects.TileSprite; 

  constructor() {
    super({
      key: "GameOverAereo",
    });
  }

  create() {
  
    this._bg = this.add.tileSprite(this.game.canvas.width / 2, this.game.canvas.height / 2, 1500, 1896, "bg_gameover").setOrigin(0.5).setScale(1.2);

    this._GameOver = this.add.image(this.game.canvas.width / 2, 50,"gameover").setAlpha(0).setScale(0.5);
    this.add.tween({
      targets: this._GameOver, y: 150, alpha: 1, duration: 1000, ease: "quad.easeInOut",

      onComplete: () => {
        this.add.tween({
          targets: this._GameOver, y: 130, repeat: -1, yoyo: true, duration: 1000, ease: "quad.easeInOut",
        });
      }
    });
    
    
    
    this._restart = this.add
      .bitmapText(620, 500, "arcade", "RIGIOCA")
      .setAlpha(1)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(100)
      .setTint(0xff8200)
      .on("pointerup", () => {
        this._restart.removeInteractive();
        this.restartGame();
      })
      .on("pointerover", () => {
        this._restart.setTint(0xff0000);
      })
      .on("pointerout", () => {
        this._restart.setTint(0xff8200);
      });
      
      
      this.scene.stop("TimerBar");
      this.scene.stop("ReputationBar");
  }

   intro() {
  
      this.scene.stop("GameOverAereo");
      this.scene.stop("Hud");
      this.scene.start("Intro");
      
   }

   restartGame() {
  
      this.scene.stop("GameOverAereo");
      this.scene.start("LivelloAereo");
      this.scene.bringToTop("LivelloAereo");
      this.scene.start("Hud");
      this.scene.bringToTop("Hud");
      this.scene.bringToTop("TimerBar");
      this.scene.bringToTop("ReputationBar");
      this.scene.bringToTop("BatteryBar");
      this.scene.bringToTop("Message");
     
   }
  
  

}
